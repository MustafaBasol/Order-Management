import { LightningElement, wire, api, track } from 'lwc';
import getProducts from '@salesforce/apex/ProductController.getProducts';
import getProductsOnLoad from '@salesforce/apex/ProductController.getProductsOnLoad';
import FORM_FACTOR from '@salesforce/client/formFactor'


export default class ProductSearchContainer extends LightningElement {
    @track categoriesToFilter = [];
    @api searchKey;
    @track productsData;
    error;
    
    @wire(getProductsOnLoad)
    wiredProducts({ error, data }) {
        if (data) {
            this.productsData = data;
            console.log('Products has been fetched successfully!');
            console.log('Fetched Products : ' + JSON.stringify(this.productsData));
            // Process the data in your custom function
          //  this.processProductData(data);
        } else if (error) {
            // Handle any errors here
            this.error = error;
            console.log('Error occured during fetching the Products! ' +  JSON.stringify(this.error));
        }
    }

    get itemSize (){
      if (FORM_FACTOR === 'Large') {
        return 4;
      } else if (FORM_FACTOR === 'Medium'){
        return 6;
      } else {
        return 12;
      }

      console.log('itemSize: ' + this.itemSize);
    }

    handleFilter(event){
        console.log('event detail : ' + JSON.stringify(event.detail));
 //
        this.categoriesToFilter = event.detail;
        console.log('searchKey: ' + JSON.stringify(this.searchKey));
        console.log('filter categories : ' + JSON.stringify(this.categoriesToFilter));

        getProducts({ categoriesToFilter:this.categoriesToFilter})
        .then((result) => {
          this.productsData = result;
          console.log('this.productsData in handleFilter : ' + JSON.stringify(this.productsData));
          this.error = null;
        })
        .catch((error) => {
          this.error = error;
          console.log('Error occured during fetching the Products! : ' + JSON.stringify(this.error));
          this.productsData = null;
        });

    }

    handleProductSelected(event){
      console.log('Product Selected');
    }

    // Getter for the @wire property
    get filteredProducts() {
        // Return the wiredProducts value, which will automatically rerun when this.filters is updated
        return this.productsData;
    }

}