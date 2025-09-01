import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Category, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  public getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(this.baseUrl)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data || [];
        })
      );
  }

  public getCategoriesWithCounts(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/with-counts`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data || [];
        })
      );
  }

  public getCategoryById(id: string): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.baseUrl, categoryData)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public updateCategory(id: string, categoryData: Partial<Category>): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${this.baseUrl}/${id}`, categoryData)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.data!;
        })
      );
  }

  public deleteCategory(id: string): Observable<string> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message);
          }
          return response.message;
        })
      );
  }
}