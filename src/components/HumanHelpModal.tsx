import React, { useState } from 'react';
import { X, Phone, MessageCircle, UserCheck, Edit2, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HumanHelpModal: React.FC = () => {
  const { isHelpModalOpen, setIsHelpModalOpen, trustedContact, setTrustedContact, language, t } =
    useLanguage();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(trustedContact.name);
  const [phone, setPhone] = useState<string>(trustedContact.phone);
  const [relation, setRelation] = useState<string>(trustedContact.relation);

  if (!isHelpModalOpen) return null;

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setTrustedContact({
      name,
      phone,
      relation,
    });
    setIsEditing(false);
  };

  const whatsappMessage =
    language === 'kn'
      ? encodeURIComponent(
          `ನಮಸ್ಕಾರ, ನಾನು ಆಸರಾ ಆ್ಯಪ್ ಬಳಸುತ್ತಿದ್ದೇನೆ. ನನಗೆ ಆನ್‌ಲೈನ್ ಸಂದೇಶ ಅಥವಾ ಪಾವತಿಯ ಬಗ್ಗೆ ಸ್ವಲ್ಪ ಅನುಮಾನವಿದೆ. ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಬಹುದೇ?`
        )
      : language === 'hi'
      ? encodeURIComponent(
          `नमस्ते, मैं आसरा ऐप इस्तेमाल कर रहा हूँ। मुझे ऑनलाइन पेमेंट या मैसेज को लेकर थोड़ी शंका है। क्या आप मेरी मदद कर सकते हैं?`
        )
      : encodeURIComponent(
          `Hello, I am using the Aasara app. I have a question about an online message or payment. Could you please guide me?`
        );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-slate-200 space-y-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => setIsHelpModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {t.needHelp[language]}
            </h2>
            <p className="text-sm text-slate-600">
              {language === 'kn'
                ? 'ಯಾವುದೇ ಗೊಂದಲವಿದ್ದರೆ ಕುಟುಂಬದವರನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ'
                : language === 'hi'
                ? 'संदेह होने पर तुरंत अपने परिवार के सदस्य से संपर्क करें'
                : 'Connect directly with your trusted family member'}
            </p>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-4">
          {!isEditing ? (
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  {language === 'kn'
                    ? 'ವಿಶ್ವಾಸಾರ್ಹ ಸಹಾಯಕರ ಹೆಸರು:'
                    : language === 'hi'
                    ? 'विश्वस्त संपर्क:'
                    : 'Trusted Helper:'}
                </p>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {trustedContact.name} ({trustedContact.relation})
                </h3>
                <p className="text-base font-bold text-slate-600 mt-1">
                  📞 {trustedContact.phone}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-700 hover:bg-blue-50 rounded-xl cursor-pointer"
                title="Edit Contact"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveContact} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Relationship</label>
                <input
                  type="text"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 rounded-lg border text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-700 text-white text-sm font-bold flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          )}

          {/* Action Call & WhatsApp Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href={`tel:${trustedContact.phone}`}
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg active:scale-95 shadow cursor-pointer text-center"
            >
              <Phone className="w-5 h-5" />
              <span>
                {language === 'kn' ? 'ನೇರವಾಗಿ ಕರೆ ಮಾಡಿ' : language === 'hi' ? 'सीधे फोन करें' : 'Call Now'}
              </span>
            </a>

            <a
              href={`https://wa.me/91${trustedContact.phone}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg active:scale-95 shadow cursor-pointer text-center"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Guidance Note */}
        <p className="text-xs text-slate-500 text-center">
          {language === 'kn'
            ? 'ನೆನಪಿಡಿ: ಅನುಮಾನ ಬಂದಾಗ ಯಾವಾಗಲೂ ಕುಟುಂಬದವರಿಗೆ ಕರೆ ಮಾಡಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳುವುದು ಅತ್ಯುತ್ತಮ.'
            : language === 'hi'
            ? 'याद रखें: संदेह होने पर हमेशा परिवार के सदस्य से पुष्टि करना सबसे सुरक्षित उपाय है।'
            : 'Remember: When in doubt, asking a family helper is always the safest choice.'}
        </p>
      </div>
    </div>
  );
};
