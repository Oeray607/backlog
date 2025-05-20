"use client";
import React, { useState } from 'react';
import { Modal, Select, Input, Form, message } from 'antd';
import data from './Isdata.json';

const { Option } = Select;
const IsEkle = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [color, setColor] = useState('');


  const names = data.Name || [];
  const statuses = data.BacklogItemStatus || [];
  const types = data.BacklogItemType || [];
  const priorities = data.Priorities || [];

  const durumEtiketleri = {
    New: "Yeni",
    InProgress: "Devam Ediyor",
    Done: "Tamamlandı",
    Closed: "Kapandı",
    Rejected: "Reddedildi"
  };
  const türEtiketleri = {
    Bug: "Hata",
    Feature: "Özellik",
    Support: "Destek",
    Analysis: "Analiz"
  };

  const rengeGoreOncelik = (value) => {
    const selectedPriority = priorities.find(p => p.label === value);
    if (selectedPriority) {
      setPriority(selectedPriority.label);
      setColor(selectedPriority.color);
    }
  };

  const handleOk = () => {
    if (name && status && type && description && priority) {
      const newItem = {
        name,
        status,
        type,
        description,
        priority,
        color,
        createdAt: new Date().toISOString(), 
      };

      onAdd(newItem); 
      message.success('İş başarıyla eklendi.');
      onClose();

        setName('');
        setStatus('');
        setType('');
        setDescription('');
        setPriority('');
        setColor('');
      } else {
        message.error('Bazı yerler eksik.');
      }
    };

return (
  <Modal
    title="İş Ekle"
    open={open}
    onOk={handleOk}
    onCancel={onClose}
    cancelText="Kapat"
    okText="Kaydet"
  >
    <Form layout="vertical">
      <Form.Item label="İsim">
        <Select value={name} onChange={(value) => setName(value)}>
          {names.map((nameOption, index) => (
            <Option key={index} value={nameOption}>
              {nameOption}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Durum">
        <Select value={status} onChange={(value) => setStatus(value)}>
          {statuses.map((statusOption, index) => (
            <Option key={index} value={statusOption}>
              {durumEtiketleri[statusOption] || statusOption}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Öncelik">
        <Select value={priority} onChange={rengeGoreOncelik}>
          {priorities.map((priorityOption, index) => (
            <Option key={index} value={priorityOption.label}>
              {priorityOption.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Tür">
        <Select value={type} onChange={(value) => setType(value)}>
          {types.map((typeOption, index) => (
            <Option key={index} value={typeOption}>
              {türEtiketleri[typeOption] || typeOption}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Açıklama">
        <Input.TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Item>
    </Form>
  </Modal>
);
};

export default IsEkle;
