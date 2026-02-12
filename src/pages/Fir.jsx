import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Fir() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const firRef = useRef();
  const [formData, setFormData] = useState(null);

  const onSubmit = async (data) => {
    setFormData(data);
    await new Promise((resolve) => setTimeout(resolve, 100));

    const input = firRef.current;
    const canvas = await html2canvas(input, {
      scrollY: -window.scrollY,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('FIR_Form.pdf');
  };

  return (
    <div className="min-h-screen bg-[#0B1B10] text-white py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white text-black rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-10">
          F.I.R Submission Form
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input {...register('fullName', { required: true })} placeholder="Full Name" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent" />
            <input {...register('fatherName', { required: true })} placeholder="Father's / Husband's Name" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent" />
            <select {...register('gender', { required: true })} className="border border-green-700 text-black gray-400 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input {...register('age', { required: true })} placeholder="Age" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent" />
            <input {...register('address', { required: true })} placeholder="Full Address" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2 bg-transparent" />
            <input {...register('phone', { required: true })} placeholder="Mobile Number" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent" />
            <input {...register('email', { required: true })} placeholder="Email ID" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent" />
            <input {...register('occupation', { required: true })} placeholder="Occupation / Place of Work" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2 bg-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input {...register('date', { required: true })} type="date" className="border border-green-700 text-black rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent" />
            <input {...register('time', { required: true })} type="time" placeholder='Time' className="border border-green-700 text-black rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent" />
            <input {...register('place', { required: true })} placeholder="Place of Occurrence" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2 bg-transparent" />
            <input {...register('district', { required: true })} placeholder="District" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent" />
            <input {...register('station', { required: true })} placeholder="Police Station" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 bg-transparent" />
            <input {...register('offenceType', { required: true })} placeholder="Offence Type" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2 bg-transparent" />
            <textarea {...register('offenceDetails', { required: true })} placeholder="Detailed Description of Offence" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2 h-24 bg-transparent" />
            <textarea {...register('accused', { required: true })} placeholder="Description of Accused (if known)" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2 h-20 bg-transparent" />
            <textarea {...register('property', { required: true })} placeholder="Details of Lost/Damaged Property (if any)" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2 h-20 bg-transparent" />
            <textarea {...register('witnesses')} placeholder="Witnesses (if any)" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 col-span-2 h-20 bg-transparent" />
          </div>

          <textarea {...register('statement', { required: true })} placeholder="Chronological Description of Incident" className="border border-green-700 text-black rounded-lg p-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 h-28 bg-transparent" />

          <div className="flex items-start gap-3">
            <input {...register('declaration', { required: true })} type="checkbox" className="mt-1" />
            <label className="text-sm">
              I hereby declare that the above information is true to the best of my knowledge.
            </label>
          </div>

          <button type="submit" className="bg-green-800 hover:bg-green-900 text-white py-2 px-6 rounded-xl w-full font-semibold shadow-md">
            Generate PDF
          </button>
        </form>

        {/* Hidden output for PDF generation */}
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }} ref={firRef}>
          {formData && (
            <div style={{ padding: '40px', maxWidth: '600px', fontSize: '14px' }}>
              <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>(3)</h2>
              <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                Sample letter format to lodge a police F.I.R for loss of original certificates
              </h3>
              <p>From</p>
              <p>{formData.fullName}</p>
              <p>{formData.address}</p>
              <p>{formData.phone}</p>
              <p>{formData.email}</p>
              <br />
              <p>To</p>
              <p>The Superintendent of Police</p>
              <p>{formData.station} Police Station, {formData.district}</p>
              <br />
              <p>Respected Sir,</p>
              <p>Sub: Loss of my original degree certificates.</p>
              <p>
                I ({formData.fullName}) hereby humbly inform you that I have lost my degree
                certificates while travelling. I tried all possible ways to recover them but could not find
                them. So I am reaching out to you to file an F.I.R. I have given a paper
                advertisement too to find my certificates. I have attached a copy of it here. Please file F.I.R for
                my loss of certificates (Write certificate numbers using xerox copy or attach them with the
                letter), which will help me apply for duplicate certificates from my university. In
                case any further details are required from my end, you may please contact me through the phone
                number given above.
              </p>
              <p>Thanking you!</p>
              <br />
              <p>Yours faithfully,</p>
              <p>[Signature]</p>
              <p>{formData.fullName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}