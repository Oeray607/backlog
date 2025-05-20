"use client"
import 'ant-design-layout/dist/ant-design-layout.css';
import { useEffect, useState } from 'react';
import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Button, Popconfirm, Modal } from 'antd';
import '@ant-design/v5-patch-for-react-19';
import './page.css';
import IsEkle from './IsEkle';
import IsDuzenle from './IsDuzenle';
import Link from 'next/link';
import data from './Isdata.json';


const { Header, Content, Sider } = Layout;
const items1 = [].map(key => ({ key }));
const items2 = [
  {
    key: 'sub1',
    icon: React.createElement(UserOutlined),
    label: 'Ali',
  },
  {
    key: 'sub2',
    icon: React.createElement(UserOutlined),
    label: 'Ahmet',
  },
  {
    key: 'sub3',
    icon: React.createElement(UserOutlined),
    label: 'Mehmet',
  },
  {
    key: 'sub4',
    icon: React.createElement(UserOutlined),
    label: 'Veli',
  },
];

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/tasks');
        const data = await response.json();
        setIsList(data);
      } catch (error) {
        console.error('Veri çekilirken hata oluştu:', error);
      }
    };

    fetchData();
  }, []);

  const İsSil = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsList(prev => prev.filter(item => item.id !== id));
      } else {
        console.error("Silme işlemi başarisiz.");
      }
    } catch (error) {
      console.error("Silme sirasinda hata:", error);
    }
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [activeComponent, setActiveComponent] = useState(null);
  const [open, setOpen] = useState(false);
  const [isList, setIsList] = useState([]);
  const [names, setNames] = useState(data.Names);
  const [seciliKullanici, setseciliKullanici] = useState('');
  const [seciliIs, setSeciliIs] = useState(null);
  const [isDetayModaliAcikMi, setIsDetayModaliAcikMi] = useState(false);
  const [isDuzenleOpen, setIsDuzenleOpen] = useState(false);
  const [duzenlenecekIs, setDuzenlenecekIs] = useState(null);

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


  const handleAddItem = async (item) => {
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        const newItem = await response.json();
        setIsList((prev) => [...prev, newItem]);
      } else {
        console.error("Sunucu POST işlemi başarısız.");
      }
    } catch (error) {
      console.error('Ekleme sırasında hata:', error);
    }
  };

  const MenuTiklama = ({ key }) => {
    setseciliKullanici(key);
    setActiveComponent(null);
  };

  const IsDetayiniAc = (is) => {
    setSeciliIs(is);
    setIsDetayModaliAcikMi(true);
  };

  const kullaniciAdiGetir = (key) => {
    const map = {
      sub1: 'Ali',
      sub2: 'Ahmet',
      sub3: 'Mehmet',
      sub4: 'Veli',
    };
    return map[key];
  };

  const KullaniciMenüsü = isList.map((item, index) => ({
    key: `item-${index}`,
    icon: React.createElement(UserOutlined),
    label: `${item.name} - ${item.type}`,
  }));

  const renkOnceligi = (priority) => {
    const renkler = data.Priorities.find(p => p.label === priority);
    return renkler ? renkler.color : 'transparent';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className='button-center'>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={items1}
          style={{ flex: 1, minWidth: 0 }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button className='button-center' onClick={() => setOpen(true)}>İş Ekle</Button>
          {/* <Button className='button-center' onClick={() => setActiveComponent('duzenle')}>İş Düzenle</Button> */}
        </div>
      </Header>

      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[seciliKullanici]}
            onClick={MenuTiklama}
            defaultSelectedKeys={['sub1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={[...items2,]}
          />
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {seciliKullanici && (
              <>
                <ul className="task-list">
                  {isList
                    .filter(item => item.name === kullaniciAdiGetir(seciliKullanici))
                    .map((item, index) => (
                      <li
                        key={index}
                        className="task-item"
                        style={{ backgroundColor: renkOnceligi(item.priority) }}
                        onClick={() => IsDetayiniAc(item)}
                      >
                        <div className="task-header">
                          <div className="task-date">
                            <strong>Oluşturulma Tarihi:</strong> {new Date(item.createdAt).toLocaleString()}
                          </div>
                          <div className="task-info">
                            <span>{türEtiketleri[item.type]} • {durumEtiketleri[item.status]}</span>
                            <p>{item.description}</p>
                          </div>
                        </div>

                        <div className="task-actions">
                          <Button
                            type="default"
                            size="middle"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDuzenlenecekIs(item);
                              setIsDuzenleOpen(true);
                            }}
                          >
                            Düzenle
                          </Button>

                          <Popconfirm
                            title="Bu işi silmek istediğinize emin misiniz?"
                            onConfirm={(e) => {
                              e.stopPropagation();
                              İsSil(item.id);
                            }}
                            okText="Evet"
                            cancelText="Hayır"
                          >
                            <Button
                              type="primary"
                              danger
                              size="middle"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Sil
                            </Button>
                          </Popconfirm>
                        </div>
                      </li>
                    ))}
                </ul>

              </>
            )}


          </Content>

          <Modal
            title="İş Detayı"
            // style={{ textAlign: 'center' }}
            open={isDetayModaliAcikMi}
            onCancel={() => setIsDetayModaliAcikMi(false)}
            footer={null}
          >
            {seciliIs && (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <p><strong>İsim:</strong> {seciliIs.name}</p>
                <p><strong>Durum:</strong> {durumEtiketleri[seciliIs.status]}</p>
                <p><strong>Tür:</strong> {türEtiketleri[seciliIs.type]}</p>
                <p><strong>Öncelik:</strong> {seciliIs.priority}</p>
                <p><strong>Açıklama:</strong><br /> {seciliIs.description}</p>
              </div>
            )}
          </Modal>


        </Layout>
      </Layout>
      <IsDuzenle
        open={isDuzenleOpen}
        onClose={() => setIsDuzenleOpen(false)}
        selectedItem={duzenlenecekIs}
        onUpdate={(updatedItem) => {
          const yeniListe = isList.map(item =>
            item.id === updatedItem.id ? updatedItem : item
          );
          setIsList(yeniListe);
          setIsDuzenleOpen(false);
        }}
      />
      <IsEkle open={open} onClose={() => setOpen(false)} onAdd={handleAddItem} />
    </Layout>
  );
};

export default App;