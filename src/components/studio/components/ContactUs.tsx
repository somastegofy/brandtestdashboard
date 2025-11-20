import React, { useState } from 'react';
import { ContactUsProps } from './types';

interface ContactUsComponentProps {
  props: ContactUsProps;
  style?: Record<string, any>;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ContactUsComponent: React.FC<ContactUsComponentProps> = ({
  props,
  style = {},
  isSelected = false,
  onClick
}) => {
  const {
    title = 'Contact Us',
    subtitle = '',
    fields = [],
    buttonText = 'Submit',
    buttonStyle = 'primary',
    backgroundColor = '#ffffff',
    borderRadius = '8px',
    padding = '24px',
    alignment = 'left',
    formAction = '',
    formMethod = 'post'
  } = props;

  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData({ ...formData, [fieldId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle form submission - in real app, this would send data to backend
    console.log('Form submitted:', formData);
  };

  const buttonClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  }[buttonStyle];

  const containerStyle: React.CSSProperties = {
    backgroundColor,
    borderRadius,
    padding,
    textAlign: alignment,
    ...style
  };

  const formStyle: React.CSSProperties = {
    textAlign: alignment
  };

  if (fields.length === 0) {
    return (
      <div style={containerStyle} className="border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">No form fields added. Add fields in settings.</p>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="w-full max-w-2xl mx-auto">
      {title && (
        <h2 className="text-2xl font-bold mb-2" style={{ textAlign: alignment }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-gray-600 mb-6" style={{ textAlign: alignment }}>
          {subtitle}
        </p>
      )}
      
      <form 
        action={formAction || undefined}
        method={formMethod}
        onSubmit={handleSubmit}
        style={formStyle}
        className="space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {fields.map((field) => (
          <div key={field.id} className="text-left">
            <label 
              htmlFor={field.id}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                name={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
            ) : field.type === 'select' ? (
              <select
                id={field.id}
                name={field.id}
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        ))}
        
        <div className="pt-2">
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${buttonClasses}`}
            style={{ textAlign: alignment }}
          >
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

// Default props for Contact Us component
export const getContactUsDefaultProps = (): ContactUsProps => ({
  title: 'Contact Us',
  subtitle: 'Get in touch with us',
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Name',
      placeholder: 'Your name',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'your@email.com',
      required: true
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Message',
      placeholder: 'Your message',
      required: true
    }
  ],
  buttonText: 'Submit',
  buttonStyle: 'primary',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '24px',
  alignment: 'left',
  formAction: '',
  formMethod: 'post'
});

