trigger SendOfferEmail on Product_Offers__c (after insert, after update) {
    // E-posta şablonunu alın
    EmailTemplate emailTemplate;
    try {
        emailTemplate = [SELECT Id, Subject, DeveloperName, HtmlValue, Body FROM EmailTemplate WHERE DeveloperName = 'Avail_Offer' LIMIT 1];
    } catch (QueryException e) {
        // E-posta şablonu bulunamazsa hata mesajını kaydedin ve isteğe bağlı olarak işlem yapın
        System.debug('Hata: E-posta şablonu ("Avail_Offer") bulunamadı. Hata: ' + e.getMessage());
        return; // Trigger'ı sonlandırabilir veya başka bir işlem yapabilirsiniz.
    }

    List<Messaging.SingleEmailMessage> emails = new List<Messaging.SingleEmailMessage>();
   List<Product_Offers__c> newOffers = [SELECT Name, Discount__c, Product__c, Product__r.Name FROM Product_Offers__c WHERE Id IN :Trigger.newMap.keySet()];

for (Product_Offers__c offer : newOffers) {
    // Product_Offer__c ile ilişkilendirilmiş Product__c Id'sini alın
    Id productId = offer.Product__c;

    // İlgili Product_Image__c kaydını bulun
    List<Product_Image__c> productImages = [SELECT Resource_URL__c FROM Product_Image__c WHERE Product__c = :productId];
    List<User> communityUsers = [SELECT Id, Name FROM User WHERE Profile.Name = 'Customer Community User' AND IsActive = true];
    for (User user : communityUsers) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setTemplateId(emailTemplate.Id);
        email.setTargetObjectId(user.Id);
        email.setSaveAsActivity(false);

        String productImageUrl = '';

        // Product_Image__c kaydı varsa, ResourceURL__c'yi alın
        if (!productImages.isEmpty()) {
            productImageUrl = productImages[0].Resource_URL__c;
        }

        // E-posta içeriği içindeki yer tutucuları değiştirin
        String htmlBody = emailTemplate.HtmlValue.replace('{!User.Name}', user.Name);
        htmlBody = htmlBody.replace('{!Product_Offer__c.Name}', offer.Name);
        htmlBody = htmlBody.replace('{!Product_Offer__c.Discount__c}', offer.Discount__c != null ? String.valueOf(offer.Discount__c) : '');
        htmlBody = htmlBody.replace('{!Product_Offer__c.Product__r.Name}', offer.Product__r.Name);
        htmlBody = htmlBody.replace('{!Product_Image__c.Resource_URL__c}', productImageUrl);

        // Aynı işlemi düz metin içeriği için de uygulayın
        String plainBody = emailTemplate.Body.replace('{!User.Name}', user.Name);
        plainBody = plainBody.replace('{!Product_Offer__c.Name}', offer.Name);
        plainBody = plainBody.replace('{!Product_Offer__c.Discount__c}', offer.Discount__c != null ? String.valueOf(offer.Discount__c) : '');
        plainBody = plainBody.replace('{!Product_Offer__c.Product__r.Name}', offer.Product__r.Name);
        plainBody = plainBody.replace('{!Product_Image__c.Resource_URL__c}', productImageUrl);

        email.setHtmlBody(htmlBody);
        email.setPlainTextBody(plainBody);
        email.setSubject(emailTemplate.Subject);
        emails.add(email);
    }
}


    // E-postaları gönderin
    Messaging.sendEmail(emails);
}