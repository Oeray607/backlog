"use client";
import React, { useEffect, useState } from 'react';
import { Modal, Select, Input, Form, message } from 'antd';
import data from './Isdata.json';

const { Option } = Select;
const IsDuzenle = ({ open, onClose, selectedItem, onUpdate }) => {
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
    const [editModalOpen, setEditModalOpen] = useState(false);

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

    // selectedItem geldiğinde state'leri güncelle
    useEffect(() => {
        if (selectedItem) {
            setName(selectedItem.name || '');
            setStatus(selectedItem.status || '');
            setType(selectedItem.type || '');
            setDescription(selectedItem.description || '');
            setPriority(selectedItem.priority || '');
            setColor(selectedItem.color || '');
        }
    }, [selectedItem]);

    const rengeGoreOncelik = (value) => {
        const selectedPriority = priorities.find(p => p.label === value);
        if (selectedPriority) {
            setPriority(selectedPriority.label);
            setColor(selectedPriority.color);
        }
    };

    const handleOk = async () => {
        if (!name || !status || !type || !description || !priority) {
            return message.warning('Lütfen tüm alanları doldurun.');
        }

        const updatedItem = {
            ...selectedItem,
            name,
            status,
            type,
            description,
            priority,
            color,
        };

        try {
            const response = await fetch(`http://localhost:3001/tasks/${selectedItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                const updatedData = await response.json();
                onUpdate(updatedData);
                message.success('İş başarıyla güncellendi!');
                onClose();
            } else {
                message.error('İş güncellenirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Hata:', error);
            message.error('Sunucuya bağlanılamadı.');
        }
    };


    const düzenleme = (item) => {
        setEditModalOpen(true); 
    };

    const listeGüncelleme = (updatedItem) => {
        const updatedList = items.map(item =>
            item.id === updatedItem.id ? updatedItem : item
        );
        setItems(updatedList);
    };

    return (
        <Modal
            title="İşi Düzenle"
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            cancelText="Kapat"
            okText="Güncelle"
        >
            <Form layout="vertical">
                <Form.Item label="İsim">
                    <Select value={name} onChange={(val) => setName(val)}>
                        {names.map((n, index) => (
                            <Option key={index} value={n}>{n}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Durum">
                    <Select value={status} onChange={(val) => setStatus(val)}>
                        {statuses.map((s, index) => (
                            <Option key={index} value={s}>
                                 {durumEtiketleri[s] || s}
                                </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Öncelik">
                    <Select value={priority} onChange={rengeGoreOncelik}>
                        {priorities.map((p, index) => (
                            <Option key={index} value={p.label}>
                                {p.label}
                                </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Tür">
                    <Select value={type} onChange={(val) => setType(val)}>
                        {types.map((t, index) => (
                            <Option key={index} value={t}>
                                {türEtiketleri[t] || t}
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

export default IsDuzenle;
