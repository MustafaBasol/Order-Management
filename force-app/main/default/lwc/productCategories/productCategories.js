import { LightningElement, wire } from 'lwc';
import getCategories from '@salesforce/apex/ProductCategoryController.getCategories';
import getChildCategories from '@salesforce/apex/ProductCategoryController.getChildCategories';


export default class ProductCategoriesComponent extends LightningElement {
  categoryStack = [];
  categories = [];

  @wire(getCategories)
  wiredCategories({ data, error }) {
    if (data) {
      this.categories = data;
    } else if (error) {
      console.error('Error fetching categories:', error);
    }
  }

  // Handle category selection, you can implement navigation logic here
  handleCategorySelection(event) {
    const categoryId = event.currentTarget.dataset.categoryid;

    getChildCategories({ parentId: categoryId })
      .then(result => {
        this.categoryStack.push(this.categories);
        this.categories = result;
      })
      .catch(error => {
        console.error('Error fetching child categories:', error);
      });
  }

  goToParentCategory() {
    if (this.categoryStack.length > 0) {
      // Eğer bir üst kategori varsa, ona dön
      this.categories = this.categoryStack.pop();
    }
  }
}