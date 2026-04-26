import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DeleteDialogComponent } from '../../shared/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-cast',
  templateUrl: './cast.component.html',
  styleUrls: ['./cast.component.scss']
})
export class CastComponent implements OnInit {
  private baseUrl = 'https://community-app-v2.onrender.com/api/v1';

  displayedColumns = ['index', 'name', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;
  error = '';
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private http: HttpClient, private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {
    this.form = this.fb.group({
      name:     ['', Validators.required],
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
    this.error = '';
    const params: any = { page: this.currentPage, perPage: this.pageSize };
    if (this.searchQuery.trim()) params.search = this.searchQuery.trim();

    this.http.get<any>(`${this.baseUrl}/admin/cast/list`, { params }).subscribe({
      next: (res) => {
        this.dataSource.data = res.data ?? [];
        this.totalRecords = res._metadata?.pagination?.total ?? 0;
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load data.'; this.loading = false; }
    });
  }

  openAdd() {
    this.drawerMode = 'add';
    this.selectedItem = null;
    this.form.reset({ name: '', isActive: true });
    this.formOpen = true;
  }

  openEdit(item: any) {
    this.drawerMode = 'edit';
    this.selectedItem = item;
    this.form.patchValue({ name: item.name, isActive: item.isActive ?? true });
    this.formOpen = true;
  }

  closeForm() {
    this.formOpen = false;
    setTimeout(() => { this.selectedItem = null; this.form.reset(); }, 300);
  }

  openDetail(item: any) {
    this.detailItem = item;
    this.detailOpen = true;
  }

  closeDetail() {
    this.detailOpen = false;
    setTimeout(() => this.detailItem = null, 300);
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const payload = this.form.value;

    const req = this.drawerMode === 'add'
      ? this.http.post(`${this.baseUrl}/admin/cast`, payload)
      : this.http.put(`${this.baseUrl}/admin/cast/${this.selectedItem.id}`, payload);

    req.subscribe({
      next: () => { this.saving = false; this.closeForm(); this.fetchList(); },
      error: () => { this.saving = false; }
    });
  }

  confirmDelete(item: any) {
    const ref = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: { name: item.name }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.http.delete(`${this.baseUrl}/admin/cast/${item.id}`).subscribe(() => this.fetchList());
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
