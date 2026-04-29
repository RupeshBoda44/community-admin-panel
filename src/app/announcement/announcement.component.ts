import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeleteDialogComponent } from '../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  private baseUrl = 'https://community-app-v2.onrender.com/api/v1';

  displayedColumns = ['index', 'title', 'text', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  saving = false;

  searchQuery = '';
  private searchSubject = new Subject<string>();

  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;

  form!: FormGroup;
  drawerMode: 'add' | 'edit' = 'add';
  selectedItem: any = null;
  formOpen = false;
  detailItem: any = null;
  detailOpen = false;

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  attachmentId: string | null = null;
  imageUploading = false;
  imageUploadError = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput!: any;

  constructor(private http: HttpClient, private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      text:  ['', Validators.required],
      isActive: [true]
    });
    this.fetchList();
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 1;
      if (this.paginator) this.paginator.firstPage();
      this.fetchList();
    });
  }

  fetchList() {
    this.loading = true;
    const params: any = { page: this.currentPage, perPage: this.pageSize };
    if (this.searchQuery.trim()) params.search = this.searchQuery.trim();

    this.http.get<any>(`${this.baseUrl}/admin/post/list`, { params }).subscribe({
      next: (res) => {
        this.dataSource.data = res.data ?? [];
        this.totalRecords = res._metadata?.pagination?.total ?? 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openAdd() {
    this.drawerMode = 'add';
    this.selectedItem = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.attachmentId = null;
    this.imageUploadError = '';
    this.form.reset({ title: '', text: '', isActive: true });
    this.formOpen = true;
  }

  openEdit(item: any) {
    this.drawerMode = 'edit';
    this.selectedItem = item;
    this.selectedFile = null;
    this.imagePreview = item.attachments?.[0]?.aws?.cdnUrl ?? null;
    this.attachmentId = item.attachments?.[0]?._id ?? null;
    this.imageUploadError = '';
    this.form.patchValue({ title: item.title, text: item.text, isActive: item.isActive ?? true });
    this.formOpen = true;
  }

  closeForm() {
    this.formOpen = false;
    setTimeout(() => {
      this.selectedItem = null;
      this.selectedFile = null;
      this.imagePreview = null;
      this.attachmentId = null;
      this.imageUploadError = '';
      if (this.fileInput) this.fileInput.nativeElement.value = '';
      this.form.reset();
    }, 300);
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);

    this.imageUploading = true;
    this.attachmentId = null;
    this.imageUploadError = '';
    const fd = new FormData();
    fd.append('document.file', file);
    fd.append('document.isPublic', 'true');
    fd.append('document.type', 'IMAGE');
    this.http.post<any>(`${this.baseUrl}/user/attachment/upload/keyed`, fd).subscribe({
      next: (res) => { this.attachmentId = res?.data?.items?.document?.[0]?._id ?? null; this.imageUploading = false; },
      error: (err) => {
        this.imageUploading = false;
        this.selectedFile = null;
        this.imagePreview = null;
        this.imageUploadError = err?.error?.message ?? 'Image upload failed.';
        if (this.fileInput) this.fileInput.nativeElement.value = '';
      }
    });
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.attachmentId = null;
    this.imageUploadError = '';
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  openDetail(item: any) { this.detailItem = item; this.detailOpen = true; }
  closeDetail() { this.detailOpen = false; setTimeout(() => this.detailItem = null, 300); }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const { title, text } = this.form.value;
    const payload: any = { title, text, type: 'ANNOUNCEMENT', tags: ['technology', 'programming'] };
    if (this.attachmentId) payload.attachments = [this.attachmentId];

    const req = this.drawerMode === 'add'
      ? this.http.post(`${this.baseUrl}/admin/post/create`, payload)
      : this.http.put(`${this.baseUrl}/admin/post/update/${this.selectedItem._id}`, payload);

    req.subscribe({
      next: () => { this.saving = false; this.closeForm(); this.fetchList(); },
      error: () => { this.saving = false; }
    });
  }


  confirmDelete(item: any) {
    const ref = this.dialog.open(DeleteDialogComponent, { width: '400px', data: { name: item.title } });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.http.delete(`${this.baseUrl}/admin/post/delete/${item._id}`).subscribe(() => this.fetchList());
      }
    });
  }

  onSearch() { this.searchSubject.next(this.searchQuery); }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.fetchList();
  }

  getRowIndex(i: number): number {
    return (this.currentPage - 1) * this.pageSize + i + 1;
  }
}
