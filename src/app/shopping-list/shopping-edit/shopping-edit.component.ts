import { Subscription } from 'rxjs';
import { ShoppingListService } from './../shopping-list.service';
import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) slForm: NgForm;
  subscription: Subscription;
  editMode: boolean = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        });
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onSubmit(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
}
