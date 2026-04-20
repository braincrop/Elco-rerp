'use client';
import React, { useState } from 'react';
import { Button, Input, Label, FormGroup } from 'reactstrap';

const Page = () => {
  const [form, setForm] = useState({
    sentType: '',
    sendTo: '',
    message: '',
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('SMS Form Data:', form);

  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh' }}
    >
      <div
        className="border rounded p-4 shadow-sm"
        style={{ width: '100%', maxWidth: 500 }}
      >
        <h3 className="text-center mb-4 custom-text">SMS Service</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="sentType" className="custom-text">
              Sent Type
            </Label>
            <Input
              type="select"
              id="sentType"
              value={form.sentType}
              onChange={(e) => handleChange('sentType', e.target.value)}
            >
              <option value="">
                Select Sent Type
              </option>
              <option value="transactional">Transactional</option>
              <option value="promotional">Promotional</option>
              <option value="otp">OTP</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="sendTo" className="custom-text">
              Send To
            </Label>
            <Input
              type="select"
              id="sendTo"
              value={form.sendTo}
              onChange={(e) => handleChange('sendTo', e.target.value)}
            >
              <option value="">Select Recipient</option>
              <option value="all">All Users</option>
              <option value="customers">Customers</option>
              <option value="admins">Admins</option>
              <option value="custom">Custom Number</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="message" className="custom-text">
              Message
            </Label>
            <Input
              type="textarea"
              id="message"
              rows="4"
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Enter your SMS message here..."
            />
          </FormGroup>
          <div className="d-grid mt-3">
            <Button color="primary" type="submit">
              Send SMS
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
