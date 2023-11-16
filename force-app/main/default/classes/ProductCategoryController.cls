public with sharing class ProductCategoryController {
    @AuraEnabled(cacheable=true)
    public static List<CategoryWrapper> getCategories(String parentId) {
        List<CategoryWrapper> categoryWrappers = new List<CategoryWrapper>();

        List<Category__c> categories = [SELECT Id, Name, ParentCategory__c FROM Category__c WHERE ParentCategory__c = :parentId];

        for (Category__c category : categories) {
            categoryWrappers.add(new CategoryWrapper(category));
        }

        return categoryWrappers;
    }

    public class CategoryWrapper {
        @AuraEnabled public Id Id { get; private set; }
        @AuraEnabled public String Name { get; private set; }

        public CategoryWrapper(Category__c category) {
            this.Id = category.Id;
            this.Name = category.Name;
        }
    }
    @AuraEnabled(cacheable=true)
public static List<CategoryWrapper> getChildCategories(String parentId) {
    List<CategoryWrapper> categoryWrappers = new List<CategoryWrapper>();

    List<Category__c> categories = [SELECT Id, Name, ParentCategory__c FROM Category__c WHERE ParentCategory__c = :parentId];

    for (Category__c category : categories) {
        categoryWrappers.add(new CategoryWrapper(category));
    }

    return categoryWrappers;
}

}