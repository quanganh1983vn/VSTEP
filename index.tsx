import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  FileText, 
  Download, 
  Send, 
  CheckCircle, 
  LayoutDashboard, 
  Table as TableIcon, 
  FileSpreadsheet, 
  Image as ImageIcon,
  LogOut,
  Upload,
  User
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

// --- Types ---

interface RegistrationData {
  id: string;
  fullName: string;
  dob: string;
  gender: string;
  pob: string; // Place of Birth
  idNumber: string;
  idDate: string;
  idPlace: string;
  phone: string;
  email: string;
  examDate: string;
  candidateType: string; // Free candidate or Student
  photo: string | null; // Base64
  idFront: string | null; // Base64
  idBack: string | null; // Base64
  submissionDate: string;
}

// --- Mock Data ---

const INITIAL_DATA: RegistrationData[] = [
  {
    id: '1715692800000',
    fullName: 'Nguyễn Văn A',
    dob: '2002-05-15',
    gender: 'Nam',
    pob: 'Hà Nội',
    idNumber: '001202000123',
    idDate: '2020-01-01',
    idPlace: 'Cục CS QLHC về TTXH',
    phone: '0987654321',
    email: 'nguyenvana@example.com',
    examDate: '2024-06-15',
    candidateType: 'Sinh viên',
    photo: null,
    idFront: null,
    idBack: null,
    submissionDate: new Date().toISOString()
  }
];

// --- Sub-Components (Defined outside App to prevent re-mounting issues) ---

const RegistrationDocument = ({ data }: { data: RegistrationData }) => (
  <div id={`form-preview-${data.id}`} className="bg-white p-12 text-black font-serif-doc w-[210mm] mx-auto shadow-none relative leading-relaxed">
     {/* PDF Specific Header */}
     <div className="flex justify-between items-start mb-6 text-center text-sm">
        <div className="w-5/12">
          <p className="font-bold">BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
          <p className="font-bold underline">TRƯỜNG ĐH NGOẠI THƯƠNG</p>
        </div>
        <div className="w-6/12">
          <p className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
          <p className="font-bold underline">Độc lập - Tự do - Hạnh phúc</p>
        </div>
      </div>

      <div className="flex items-start gap-6 mt-8">
        <div className="w-24 h-32 border border-black flex-shrink-0">
          {data.photo && <img src={data.photo} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-grow text-center">
          <h1 className="text-xl font-bold uppercase">PHIẾU ĐĂNG KÝ DỰ THI</h1>
          <h2 className="text-lg font-bold uppercase mt-1">ĐÁNH GIÁ NĂNG LỰC TIẾNG ANH (BẬC 3-5)</h2>
          <p className="italic mt-2">Kính gửi: Hội đồng thi Trường Đại học Ngoại Thương</p>
        </div>
      </div>

      <div className="mt-8 space-y-3 text-base">
        <div className="flex">
          <span className="w-48 font-bold">1. Họ và tên:</span>
          <span className="flex-grow uppercase font-bold border-b border-dotted border-black">{data.fullName}</span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex flex-grow">
            <span className="w-32 font-bold">2. Ngày sinh:</span>
            <span className="flex-grow border-b border-dotted border-black">{new Date(data.dob).toLocaleDateString('vi-VN')}</span>
          </div>
          <div className="flex w-1/3">
            <span className="w-24 font-bold">Giới tính:</span>
            <span className="flex-grow border-b border-dotted border-black">{data.gender}</span>
          </div>
        </div>

        <div className="flex">
          <span className="w-48 font-bold">3. Nơi sinh:</span>
          <span className="flex-grow border-b border-dotted border-black">{data.pob}</span>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-grow">
            <span className="w-48 font-bold">4. Số CMND/CCCD:</span>
            <span className="flex-grow border-b border-dotted border-black">{data.idNumber}</span>
          </div>
          <div className="flex w-1/3">
            <span className="w-24 font-bold">Ngày cấp:</span>
            <span className="flex-grow border-b border-dotted border-black">{new Date(data.idDate).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        <div className="flex">
          <span className="w-48 font-bold">5. Nơi cấp:</span>
          <span className="flex-grow border-b border-dotted border-black">{data.idPlace}</span>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-grow">
            <span className="w-32 font-bold">6. ĐT liên hệ:</span>
            <span className="flex-grow border-b border-dotted border-black">{data.phone}</span>
          </div>
          <div className="flex flex-grow">
            <span className="w-24 font-bold">Email:</span>
            <span className="flex-grow border-b border-dotted border-black">{data.email}</span>
          </div>
        </div>

        <div className="flex">
          <span className="w-48 font-bold">7. Đối tượng:</span>
          <span className="flex-grow border-b border-dotted border-black">{data.candidateType}</span>
        </div>

        <div className="flex">
          <span className="w-48 font-bold">8. Kỳ thi ngày:</span>
          <span className="flex-grow border-b border-dotted border-black">{new Date(data.examDate).toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      <div className="mt-8">
         <p className="font-bold mb-2">Ảnh CCCD/CMND:</p>
         <div className="flex justify-center gap-8 h-40">
            {data.idFront && <img src={data.idFront} className="h-full object-contain border" />}
            {data.idBack && <img src={data.idBack} className="h-full object-contain border" />}
         </div>
      </div>

      <div className="mt-8 flex justify-between">
          <div className="w-1/2 text-center">
            {/* Left side empty for this form type */}
          </div>
          <div className="w-1/2 text-center">
            <p className="italic">Hà Nội, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
            <p className="font-bold uppercase mt-1">Người làm đơn</p>
            <p className="italic text-sm">(Ký và ghi rõ họ tên)</p>
            <div className="h-24"></div>
            <p className="font-bold uppercase">{data.fullName}</p>
          </div>
      </div>
  </div>
);

interface RegistrationFormProps {
  formData: Partial<RegistrationData>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'idFront' | 'idBack') => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const RegistrationFormView: React.FC<RegistrationFormProps> = ({ formData, onChange, onFileUpload, onSubmit, isLoading }) => (
  <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden my-8 border border-gray-200">
    <div className="bg-blue-900 text-white p-6 text-center">
      <h1 className="text-2xl font-bold uppercase">Đơn Đăng Ký Dự Thi Đánh Giá Năng Lực Tiếng Anh</h1>
      <p className="mt-2 text-blue-200">Bậc 3-5 (VSTEP) - Trường Đại học Ngoại Thương</p>
    </div>

    <form onSubmit={onSubmit} className="p-8 space-y-6 font-serif-doc">
      
      {/* Header Document Style */}
      <div className="flex justify-between items-start mb-8 text-center text-sm">
        <div className="w-1/3">
          <p className="font-bold">BỘ GIÁO DỤC VÀ ĐÀO TẠO</p>
          <p className="font-bold underline">TRƯỜNG ĐH NGOẠI THƯƠNG</p>
        </div>
        <div className="w-1/2">
          <p className="font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
          <p className="font-bold underline">Độc lập - Tự do - Hạnh phúc</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Photo Upload */}
        <div className="col-span-1 flex flex-col items-center space-y-2">
           <div className="w-32 h-40 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative">
             {formData.photo ? (
               <img src={formData.photo} alt="Portrait" className="w-full h-full object-cover" />
             ) : (
               <div className="text-center text-gray-400 p-2">
                 <User className="w-8 h-8 mx-auto mb-1" />
                 <span className="text-xs">Ảnh 3x4 hoặc 4x6</span>
               </div>
             )}
             <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => onFileUpload(e, 'photo')}
                className="absolute inset-0 opacity-0 cursor-pointer"
                required
              />
           </div>
           <p className="text-xs text-gray-500 italic">Nhấn để tải ảnh thẻ</p>
        </div>

        {/* Personal Info */}
        <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-1">Họ và tên thí sinh (Full Name) <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              name="fullName"
              value={formData.fullName || ''}
              className="w-full border border-gray-300 p-2 rounded uppercase"
              placeholder="NGUYỄN VĂN A"
              onChange={onChange}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-1">Ngày sinh (DOB) <span className="text-red-500">*</span></label>
            <input 
              required
              type="date" 
              name="dob"
              value={formData.dob || ''}
              className="w-full border border-gray-300 p-2 rounded"
              onChange={onChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Giới tính (Gender)</label>
            <select 
              name="gender" 
              className="w-full border border-gray-300 p-2 rounded"
              onChange={onChange}
              value={formData.gender || 'Nam'}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 font-bold mb-1">Nơi sinh (Place of Birth) <span className="text-red-500">*</span></label>
            <input 
              required
              type="text" 
              name="pob"
              value={formData.pob || ''}
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Tỉnh/Thành phố"
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* ID Info */}
      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 font-bold mb-1">Số CCCD/CMND <span className="text-red-500">*</span></label>
          <input 
            required
            type="text" 
            name="idNumber"
            value={formData.idNumber || ''}
            className="w-full border border-gray-300 p-2 rounded"
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-1">Ngày cấp <span className="text-red-500">*</span></label>
          <input 
            required
            type="date" 
            name="idDate"
            value={formData.idDate || ''}
            className="w-full border border-gray-300 p-2 rounded"
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-1">Nơi cấp <span className="text-red-500">*</span></label>
          <input 
            required
            type="text" 
            name="idPlace"
            value={formData.idPlace || ''}
            className="w-full border border-gray-300 p-2 rounded"
            onChange={onChange}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-bold mb-1">Số điện thoại <span className="text-red-500">*</span></label>
          <input 
            required
            type="tel" 
            name="phone"
            value={formData.phone || ''}
            className="w-full border border-gray-300 p-2 rounded"
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-1">Email <span className="text-red-500">*</span></label>
          <input 
            required
            type="email" 
            name="email"
            value={formData.email || ''}
            className="w-full border border-gray-300 p-2 rounded"
            onChange={onChange}
          />
        </div>
      </div>

      {/* Exam Details */}
      <div className="bg-gray-50 p-4 rounded border border-gray-200">
        <h3 className="font-bold text-lg mb-4 text-blue-900 border-b pb-2">Thông Tin Dự Thi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Đối tượng dự thi</label>
            <select 
              name="candidateType" 
              className="w-full border border-gray-300 p-2 rounded"
              onChange={onChange}
              value={formData.candidateType || 'Thí sinh tự do'}
            >
              <option value="Thí sinh tự do">Thí sinh tự do</option>
              <option value="Sinh viên">Sinh viên</option>
              <option value="Cao học">Cao học</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1">Ngày thi dự kiến</label>
            <input 
              type="date" 
              name="examDate"
              className="w-full border border-gray-300 p-2 rounded bg-gray-100"
              value={formData.examDate || ''}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* ID Card Uploads */}
      <div>
        <label className="block text-gray-700 font-bold mb-2">Ảnh chụp CCCD/CMND (2 mặt) <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative h-32 flex items-center justify-center">
            {formData.idFront ? (
              <img src={formData.idFront} className="max-h-full object-contain" />
            ) : (
              <div className="text-gray-400">
                <Upload className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Mặt trước</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => onFileUpload(e, 'idFront')} className="absolute inset-0 opacity-0 cursor-pointer" required />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative h-32 flex items-center justify-center">
            {formData.idBack ? (
              <img src={formData.idBack} className="max-h-full object-contain" />
            ) : (
              <div className="text-gray-400">
                <Upload className="w-6 h-6 mx-auto mb-1" />
                <span className="text-sm">Mặt sau</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => onFileUpload(e, 'idBack')} className="absolute inset-0 opacity-0 cursor-pointer" required />
          </div>
        </div>
      </div>

      {/* Declaration */}
      <div className="text-sm text-justify mt-6">
        <p>Tôi xin cam đoan những lời khai trên là đúng sự thật. Nếu sai tôi xin chịu hoàn toàn trách nhiệm trước pháp luật và các quy định của Hội đồng thi.</p>
      </div>

      <div className="flex justify-center mt-8">
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded shadow-lg flex items-center gap-2 transition transform hover:scale-105"
        >
          {isLoading ? (
            <span>Đang xử lý...</span>
          ) : (
            <>
              <Send size={20} />
              Gửi Đăng Ký
            </>
          )}
        </button>
      </div>
    </form>
  </div>
);

interface SuccessViewProps {
  currentRegistration: RegistrationData | null;
  onGeneratePDF: (data: RegistrationData) => void;
  onNewRegistration: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ currentRegistration, onGeneratePDF, onNewRegistration }) => (
  <div className="max-w-4xl mx-auto my-8 space-y-6">
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow">
      <div className="flex items-center gap-3">
        <CheckCircle className="h-6 w-6" />
        <div>
          <p className="font-bold">Đăng ký thành công!</p>
          <p className="text-sm">Email xác nhận đã được gửi tới {currentRegistration?.email}. Vui lòng tải phiếu đăng ký bên dưới.</p>
        </div>
      </div>
    </div>

    <div className="bg-gray-200 p-8 rounded-lg flex justify-center overflow-auto max-h-[600px] border">
      {currentRegistration && <RegistrationDocument data={currentRegistration} />}
    </div>

    <div className="flex justify-center gap-4">
      <button 
        onClick={() => currentRegistration && onGeneratePDF(currentRegistration)}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded shadow flex items-center gap-2"
      >
        <Download size={20} />
        Tải PDF
      </button>
      <button 
        onClick={onNewRegistration}
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded shadow"
      >
        Đăng ký mới
      </button>
    </div>
  </div>
);

interface AdminViewProps {
  registrations: RegistrationData[];
  onExportExcel: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ registrations, onExportExcel }) => (
  <div className="max-w-7xl mx-auto my-8 p-4">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <LayoutDashboard />
        Quản Trị Hồ Sơ
      </h2>
      <div className="flex gap-2">
        <button 
           onClick={onExportExcel}
           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium shadow"
        >
          <FileSpreadsheet size={16} /> Xuất Excel
        </button>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thí sinh</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CCCD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.map((reg) => (
              <tr key={reg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{reg.fullName}</div>
                  <div className="text-sm text-gray-500">{reg.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.idNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{reg.examDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reg.photo ? <CheckCircle size={16} className="text-green-500" /> : <span className="text-red-500">-</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => {
                      alert("Tính năng in từ admin: Mở chi tiết để in (Đang phát triển)");
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mx-2"
                    title="Xuất PDF"
                  >
                    <FileText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
    {/* Hidden container for PDF Generation context if needed later */}
    <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
        {registrations.map(r => (
          <div key={r.id}>
            <RegistrationDocument data={r} />
          </div>
        ))}
    </div>
  </div>
);

// --- Main App Component ---

const App = () => {
  const [view, setView] = useState<'form' | 'success' | 'admin'>('form');
  const [registrations, setRegistrations] = useState<RegistrationData[]>(INITIAL_DATA);
  const [currentRegistration, setCurrentRegistration] = useState<RegistrationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<RegistrationData>>({
    gender: 'Nam',
    candidateType: 'Thí sinh tự do',
    examDate: '2024-06-15' // Default mock date
  });

  const formRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'photo' | 'idFront' | 'idBack') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call and Email sending
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newRegistration: RegistrationData = {
      ...formData as RegistrationData,
      id: Date.now().toString(),
      submissionDate: new Date().toISOString(),
    };

    setRegistrations(prev => [...prev, newRegistration]);
    setCurrentRegistration(newRegistration);
    setIsLoading(false);
    setView('success');
  };

  const generatePDF = async (data: RegistrationData, download = true) => {
    const element = document.getElementById(`form-preview-${data.id}`);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    if (download) {
      pdf.save(`VSTEP_Registration_${data.fullName}.pdf`);
    }
    return pdf;
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(registrations.map(r => ({
      "Mã hồ sơ": r.id,
      "Họ và tên": r.fullName,
      "Ngày sinh": r.dob,
      "Giới tính": r.gender,
      "SĐT": r.phone,
      "Email": r.email,
      "Ngày thi": r.examDate,
      "Đối tượng": r.candidateType,
      "Ngày nộp": new Date(r.submissionDate).toLocaleString('vi-VN')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách đăng ký");
    XLSX.writeFile(wb, "VSTEP_Registrations.xlsx");
  };

  const resetForm = () => {
    setFormData({
       gender: 'Nam',
       candidateType: 'Thí sinh tự do',
       examDate: '2024-06-15'
    });
    setCurrentRegistration(null);
    setView('form');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      <nav className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('form')}>
              <FileText className="h-8 w-8 text-yellow-400" />
              <span className="font-bold text-xl tracking-wide">VSTEP PORTAL</span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setView('form')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${view === 'form' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800'}`}
              >
                Đăng ký
              </button>
              <button 
                onClick={() => setView('admin')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${view === 'admin' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800'}`}
              >
                Quản trị (Admin)
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pb-12">
        {view === 'form' && (
          <RegistrationFormView 
            formData={formData} 
            onChange={handleInputChange} 
            onFileUpload={handleFileUpload} 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
        {view === 'success' && (
          <SuccessView 
            currentRegistration={currentRegistration}
            onGeneratePDF={generatePDF}
            onNewRegistration={resetForm}
          />
        )}
        {view === 'admin' && (
          <AdminView 
            registrations={registrations}
            onExportExcel={exportExcel}
          />
        )}
      </main>
      
      <footer className="bg-white border-t mt-auto py-6 text-center text-gray-500 text-sm">
        <p>© 2024 Trung tâm Khảo thí - Trường Đại học Ngoại Thương</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);