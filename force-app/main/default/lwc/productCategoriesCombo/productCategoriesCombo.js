import { LightningElement, api, wire, track } from 'lwc';
import getCategories from "@salesforce/apex/ProductCategoriesController.getCategories";


export default class ProductCategoriesCombo extends LightningElement {

    @track error;   //this holds errors

    @track allCategories = [];
    @track parentCategories = [];
    @track subCategories1;
    @track subCategories2;
    selectedParentCategory;
    selectedSubCategory1;
    selectedSubCategory2;
    @api selectedCategory;
    @track categoriesToFilter = [];
    
    @wire(getCategories) wiredCategories({ error, data }) {
        if (data) {
          console.log("JSON Data : " + JSON.stringify(data));
            for(let i=0; i<data.length; i++) {
                this.allCategories = [...this.allCategories ,{value: data[i].Id , label: data[i].Name, parentCategoryId: data[i].ParentCategory__c}];
                if (data[i].ParentCategory__c == null){
                    this.parentCategories = [...this.parentCategories ,{value: data[i].Id , label: data[i].Name}];
                }                                   
            }                
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.log('Error : ' + JSON.stringify(this.error));
        }
    }

    handleParentCategoryChange(event) {
        this.selectedParentCategory = event.detail.value;
        console.log('this.allCategories in onchange : ' + this.allCategories);
        this.subCategories1 = this.allCategories.filter(category => category.parentCategoryId == this.selectedParentCategory);
        this.subCategories2 = null;
        this.categoriesToFilter = [];
        this.selectedSubCategory1 = null;
        this.selectedSubCategory2 = null;
        console.log('this.selectedParentCategory: ' + this.selectedParentCategory);
    }
  
    handleSubCategory1Change(event) {
        this.selectedSubCategory1 = event.detail.value;
        this.subCategories2 = this.allCategories.filter(category => category.parentCategoryId == this.selectedSubCategory1);
        this.subCategories2 = this.subCategories2.length > 0 ? this.subCategories2 : undefined;
        this.selectedSubCategory2 = null;
        this.categoriesToFilter = [];
        console.log('this.selectedSubCategory1: ' + this.selectedSubCategory1);
  
    }
  
    handleSubCategory2Change(event) {
        this.selectedSubCategory2 = event.detail.value;
        this.categoriesToFilter = [];
        console.log('this.selectedSubCategory2: ' + this.selectedSubCategory2);
    } 

    includeChildCategories(parentCategoryId){
        // this.selectedCategory.push.apply(this.allCategories.filter(c => c.parentCategoryId == category));
        let childCategories = [];
        let childCategoryIds = [];
        let grandChildCategories = [];
        //childCategories = this.allCategories.filter(c => c.parentCategoryId == category);
        this.allCategories.forEach( c=> {
            if (c.parentCategoryId == parentCategoryId){
                childCategories.push(c);
                childCategoryIds.push(c.value);
            }
        });

        if (childCategories.length > 0){

          childCategories.forEach (item => {

             grandChildCategories = this.allCategories.filter(c => c.parentCategoryId == item.value);

             if (grandChildCategories.length > 0){
                grandChildCategories.forEach (gcCategory => {
                    childCategoryIds.push (gcCategory.value);
             }) 
            }
          });
         }

         console.log('childCategories in includeChildCategories' + childCategoryIds);
         return childCategoryIds;
     }

    handleFilterClick(){
        if (this.selectedSubCategory2){
            this.selectedCategory = this.selectedSubCategory2;
        } else if(this.selectedSubCategory1){
            this.selectedCategory = this.selectedSubCategory1;
        }else {
            this.selectedCategory = this.selectedParentCategory;
        }

        if (this.selectedCategory){
            let childCategories = [];
            childCategories = this.includeChildCategories (this.selectedCategory);
            this.categoriesToFilter.push(this.selectedCategory); 
            if (childCategories.length > 0){
                this.categoriesToFilter.push(...childCategories);
            }
        }
        console.log('categoriesToFilter for Filtering : ' + this.categoriesToFilter );

        const searchEvent = new CustomEvent("filter", { detail: this.categoriesToFilter});
	    this.dispatchEvent(searchEvent);
    }

}