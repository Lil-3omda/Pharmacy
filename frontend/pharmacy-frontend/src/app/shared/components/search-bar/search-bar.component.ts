import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MedicineService, Medicine } from '../../../core/services/medicine.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<Medicine>();

  searchTerm = '';
  suggestions: Medicine[] = [];
  showSuggestions = false;
  private searchSubject = new Subject<string>();

  constructor(private medicineService: MedicineService) {}

  ngOnInit() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(term => {
        if (term.length >= 2) {
          this.loadSuggestions(term);
        } else {
          this.suggestions = [];
          this.showSuggestions = false;
        }
      });
  }

  onSearchInput() {
    this.searchSubject.next(this.searchTerm);
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.search.emit(this.searchTerm.trim());
      this.hideSuggestions();
    }
  }

  selectSuggestion(medicine: Medicine) {
    this.searchTerm = medicine.nameAr;
    this.suggestionSelected.emit(medicine);
    this.hideSuggestions();
  }

  private loadSuggestions(term: string) {
    this.medicineService.getMedicines({ searchTerm: term }).subscribe({
      next: (medicines) => {
        this.suggestions = medicines.slice(0, 5);
        this.showSuggestions = this.suggestions.length > 0;
      },
      error: () => {
        this.suggestions = [];
        this.showSuggestions = false;
      }
    });
  }

  private hideSuggestions() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}