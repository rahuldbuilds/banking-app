import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import type { CustomerDto } from '../types';

interface CustomerKycViewProps {
  customers: CustomerDto[];
  userRole?: string;
  onCreateCustomer: (customer: CustomerDto) => Promise<void>;
}

export const CustomerKycView: React.FC<CustomerKycViewProps> = ({
  customers,
  userRole,
  onCreateCustomer
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [personalPhoto, setPersonalPhoto] = useState('');
  const [aadharPhoto, setAadharPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canRegisterCustomer = !userRole || ['ADMIN', 'ACCOUNT_CREATOR'].includes(userRole);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) {
      return alert('Please fill in required customer details');
    }

    setIsLoading(true);
    try {
      await onCreateCustomer({
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        aadharCardNo: aadharNo,
        personalPhoto: personalPhoto || undefined,
        aadharCardPhoto: aadharPhoto || undefined
      });

      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setAadharNo('');
      setPersonalPhoto('');
      setAadharPhoto('');
      alert('KYC Customer Profile successfully registered!');
    } catch (err: any) {
      alert(`Customer Registration Failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Customer KYC & Onboarding</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Register new customers with verified identity card documents and photographs
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: canRegisterCustomer ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Left Column - Onboarding Form */}
        {canRegisterCustomer && (
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <UserPlus size={22} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>New Customer Onboarding</h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Rahul"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Yadav"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                  AADHAR CARD / GOVT ID NUMBER
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="5489-1234-9012"
                  value={aadharNo}
                  onChange={(e) => setAadharNo(e.target.value)}
                />
              </div>

              {/* Document File Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    PERSONAL PROFILE PHOTO
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, setPersonalPhoto)}
                    style={{ fontSize: '0.78rem' }}
                  />
                  {personalPhoto && (
                    <img src={personalPhoto} alt="Profile Preview" style={{ marginTop: '0.5rem', width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    AADHAR DOCUMENT SCAN
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, setAadharPhoto)}
                    style={{ fontSize: '0.78rem' }}
                  />
                  {aadharPhoto && (
                    <img src={aadharPhoto} alt="Aadhar Preview" style={{ marginTop: '0.5rem', width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                {isLoading ? 'Registering Customer...' : 'Complete KYC Customer Onboarding'}
              </button>
            </form>
          </div>
        )}

        {/* Right Column - Registered Customers Directory */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Verified Customer Registry</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {customers.map(c => (
              <div key={c.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderRadius: '12px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {c.firstName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {c.firstName} {c.lastName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {c.email} • {c.phoneNumber}
                    </div>
                    {c.aadharCardNo && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                        Aadhar: {c.aadharCardNo}
                      </div>
                    )}
                  </div>
                </div>

                <span className="badge badge-active">KYC VERIFIED</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
