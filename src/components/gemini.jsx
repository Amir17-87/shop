import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Input,
  List,
  Modal,
  Form,
  message,
  Spin,
  Layout,
  Typography,
  Space,
  ConfigProvider,
  Tooltip,
  Row,
  Col,
  Card,
  Empty,
  Checkbox // برای انتخاب وظایف پیشنهادی
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RobotOutlined,
  ExperimentOutlined,
  SaveOutlined,
  CloseOutlined,
  UnorderedListOutlined,
  BulbOutlined // آیکون جدید برای پیشنهاد وظایف
} from '@ant-design/icons';
import fa_IR from 'antd/lib/locale/fa_IR'; // برای فارسی‌سازی کامپوننت‌ها

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Gemini API Configuration
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = ""; // کلید API خود را اینجا وارد کنید

// Helper Function
const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

function Gemini() {
  const [tasks, setTasks] = useState([]);
  const [form] = Form.useForm(); // برای فرم افزودن آیتم
  const [editForm] = Form.useForm(); // برای فرم ویرایش آیتم

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [breakdownTask, setBreakdownTask] = useState(null);
  const [breakdownResult, setBreakdownResult] = useState(null);
  const [currentBrokenDownTasks, setCurrentBrokenDownTasks] = useState([]);

  const [isSuggestTasksModalOpen, setIsSuggestTasksModalOpen] = useState(false);
  const [suggestingForTask, setSuggestingForTask] = useState(null);
  const [suggestedTasks, setSuggestedTasks] = useState([]); // [{id: string, text: string}]
  const [selectedSuggestedTasks, setSelectedSuggestedTasks] = useState([]); // [id]

  const [loadingStates, setLoadingStates] = useState({
    addingTask: false,
    generatingDescription: false,
    breakingDownTask: false,
    editingTask: false,
    suggestingTasks: false, // وضعیت بارگذاری برای پیشنهاد وظایف
  });

  // بارگذاری وظایف از localStorage هنگام شروع برنامه
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('todoAntdAppTasksV3'); // کلید جدید برای جلوگیری از تداخل
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("خطا در بارگذاری وظایف از localStorage:", error);
      message.error("خطا در بارگذاری وظایف ذخیره شده.");
    }
  }, []);

  // ذخیره وظایف در localStorage هر بار که لیست وظایف تغییر می‌کند
  useEffect(() => {
    try {
      localStorage.setItem('todoAntdAppTasksV3', JSON.stringify(tasks));
    } catch (error) {
      console.error("خطا در ذخیره وظایف در localStorage:", error);
      message.error("خطا در ذخیره خودکار وظایف.");
    }
  }, [tasks]);

  // تابع برای فراخوانی Gemini API
  const callGeminiApi = useCallback(async (promptText) => {
    if (!API_KEY) {
        message.error('کلید API برای Gemini تنظیم نشده است. لطفاً ابتدا کلید را در کد برنامه و در متغیر API_KEY قرار دهید.');
        console.warn("کلید API برای Gemini تنظیم نشده است.");
        throw new Error('API Key not set');
    }
    const fullApiUrl = `${GEMINI_API_URL}?key=${API_KEY}`;
    const payload = {
      contents: [{ role: "user", parts: [{ text: promptText }] }]
    };
    try {
      const response = await fetch(fullApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('خطای Gemini API:', errorData);
        throw new Error(errorData.error?.message || `خطا در ارتباط با API: ${response.status}`);
      }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
      } else {
        console.error('پاسخ نامعتبر از Gemini API:', result);
        throw new Error('پاسخ نامعتبر از Gemini API دریافت شد.');
      }
    } catch (error) {
      message.error(`خطا در ارتباط با هوش مصنوعی: ${error.message}`);
      console.error('خطا در فراخوانی Gemini API:', error);
      throw error;
    }
  }, []);

  // تابع برای افزودن وظیفه جدید
  const handleAddTask = async (values) => {
    setLoadingStates(prev => ({ ...prev, addingTask: true }));
    const newTask = {
      id: generateId(),
      text: values.taskInput,
      description: values.descriptionInput || '',
    };
    setTasks([newTask, ...tasks]);
    form.resetFields();
    message.success('آیتم جدید با موفقیت اضافه شد!');
    setLoadingStates(prev => ({ ...prev, addingTask: false }));
  };

  // تابع برای تولید توضیحات خودکار با Gemini
  const handleGenerateDescription = async () => {
    const taskTitle = form.getFieldValue('taskInput');
    if (!taskTitle || taskTitle.trim() === '') {
      message.warning('لطفاً ابتدا عنوان وظیفه را وارد کنید.');
      return;
    }
    setLoadingStates(prev => ({ ...prev, generatingDescription: true }));
    try {
      const prompt = `برای این وظیفه یک توضیح کوتاه و مفید در حد یک یا دو جمله بنویس: "${taskTitle.trim()}"`;
      const generatedDescription = await callGeminiApi(prompt);
      form.setFieldsValue({ descriptionInput: generatedDescription.trim() });
      message.success('توضیحات با موفقیت توسط هوش مصنوعی تولید شد!');
    } catch (error) {
      // Error handled in callGeminiApi
    } finally {
      setLoadingStates(prev => ({ ...prev, generatingDescription: false }));
    }
  };

  // باز کردن مودال ویرایش
  const openEditModal = (task) => {
    setEditingTask(task);
    editForm.setFieldsValue({
      editTaskInput: task.text,
      editDescriptionInput: task.description || '',
    });
    setIsEditModalOpen(true);
  };

  // ذخیره تغییرات ویرایش شده
  const handleSaveEdit = async (values) => {
    if (!editingTask) return;
    setLoadingStates(prev => ({ ...prev, editingTask: true }));
    setTasks(tasks.map(task =>
      task.id === editingTask.id
        ? { ...task, text: values.editTaskInput.trim(), description: (values.editDescriptionInput || '').trim() }
        : task
    ));
    setIsEditModalOpen(false);
    setEditingTask(null);
    message.success('آیتم با موفقیت ویرایش شد.');
    setLoadingStates(prev => ({ ...prev, editingTask: false }));
  };

  // نمایش تأییدیه برای حذف وظیفه
  const showDeleteConfirm = (taskId) => {
    Modal.confirm({
      title: 'تأیید حذف',
      icon: <DeleteOutlined style={{ color: 'red' }} />,
      content: 'آیا از حذف این آیتم مطمئن هستید؟ این عمل قابل بازگشت نیست.',
      okText: 'حذف',
      okType: 'danger',
      cancelText: 'لغو',
      onOk() {
        setTasks(tasks.filter(task => task.id !== taskId));
        message.success('آیتم با موفقیت حذف شد.');
      },
      centered: true,
    });
  };
  
  // باز کردن مودال تجزیه وظیفه و فراخوانی Gemini
  const openBreakdownModalHandler = async (task) => {
    setBreakdownTask(task);
    setBreakdownResult(null);
    setCurrentBrokenDownTasks([]);
    setIsBreakdownModalOpen(true);
    setLoadingStates(prev => ({ ...prev, breakingDownTask: true }));
    try {
      const prompt = `این وظیفه را به مراحل کوچکتر و قابل اجرا تجزیه کن: "${task.text}". هر مرحله را در یک خط جدید و با یک خط تیره (-) در ابتدای آن بنویس.`;
      const resultText = await callGeminiApi(prompt);
      const steps = resultText.split('\n').map(step => step.trim()).filter(step => step.startsWith('- ') || (step.length > 0 && !step.startsWith('-')) );
      
      if (steps.length > 0) {
        setCurrentBrokenDownTasks(steps.map(s => s.replace(/^- /, '')));
        const formattedResult = steps.map((step, index) => <Paragraph key={index} style={{ margin: '4px 0', paddingRight: '8px', borderRight: '2px solid #1890ff' }}>{step.replace(/^- /, '')}</Paragraph>);
        setBreakdownResult(<div>{formattedResult}</div>);
      } else {
        setBreakdownResult(<Text type="secondary">مرحله‌ای برای نمایش یافت نشد یا هوش مصنوعی نتوانست آن را تجزیه کند.</Text>);
      }
      message.success('وظیفه با موفقیت توسط هوش مصنوعی تجزیه شد!');
    } catch (error) {
      setBreakdownResult(<Text type="danger">خطا در تجزیه وظیفه. لطفاً دوباره تلاش کنید.</Text>);
    } finally {
      setLoadingStates(prev => ({ ...prev, breakingDownTask: false }));
    }
  };

  // افزودن مراحل تجزیه شده به لیست وظایف اصلی
  const handleAddBrokenDownTasks = () => {
    if (currentBrokenDownTasks.length > 0 && breakdownTask) {
      const newSubTasks = currentBrokenDownTasks.map(taskText => ({
        id: generateId(),
        text: taskText,
        description: `زیرمجموعه وظیفه: ${breakdownTask.text}`
      }));
      setTasks([...newSubTasks, ...tasks]);
      setIsBreakdownModalOpen(false);
      message.success(`${currentBrokenDownTasks.length} مرحله به لیست وظایف اضافه شد.`);
    }
  };

  // باز کردن مودال پیشنهاد وظایف مرتبط
  const openSuggestTasksModalHandler = async (task) => {
    setSuggestingForTask(task);
    setSuggestedTasks([]);
    setSelectedSuggestedTasks([]);
    setIsSuggestTasksModalOpen(true);
    setLoadingStates(prev => ({ ...prev, suggestingTasks: true }));
    try {
      const prompt = `با توجه به وظیفه اصلی: "${task.text}"، چند وظیفه مرتبط یا اقدام بعدی که ممکن است کاربر فراموش کرده باشد را پیشنهاد بده. لطفاً 3 تا 5 پیشنهاد ارائه کن. هر پیشنهاد را در یک خط جدید و با یک خط تیره (-) در ابتدای آن بنویس.`;
      const resultText = await callGeminiApi(prompt);
      const suggestions = resultText.split('\n')
        .map(s => s.trim().replace(/^- /, ''))
        .filter(s => s.length > 0)
        .map(s => ({ id: generateId(), text: s })); // Assign unique IDs for checkbox group

      if (suggestions.length > 0) {
        setSuggestedTasks(suggestions);
      } else {
        message.info('هوش مصنوعی پیشنهاد مرتبطی برای این وظیفه پیدا نکرد.');
      }
    } catch (error) {
      // Error handled in callGeminiApi
      message.error('خطا در دریافت پیشنهادات از هوش مصنوعی.');
    } finally {
      setLoadingStates(prev => ({ ...prev, suggestingTasks: false }));
    }
  };
  
  // افزودن وظایف پیشنهادی انتخاب شده به لیست اصلی
  const handleAddSelectedSuggestedTasks = () => {
    if (selectedSuggestedTasks.length > 0 && suggestingForTask) {
      const tasksToAdd = suggestedTasks
        .filter(task => selectedSuggestedTasks.includes(task.id))
        .map(task => ({
          id: generateId(), // Generate new ID for the main list
          text: task.text,
          description: `پیشنهاد شده برای وظیفه: ${suggestingForTask.text}`
        }));
      
      setTasks([...tasksToAdd, ...tasks]);
      message.success(`${tasksToAdd.length} وظیفه پیشنهادی به لیست اضافه شد.`);
      setIsSuggestTasksModalOpen(false);
    } else {
      message.warning('هیچ وظیفه پیشنهادی برای افزودن انتخاب نشده است.');
    }
  };


  return (
    <ConfigProvider direction="rtl" locale={fa_IR}>
      <Layout style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f2f5, #e6f7ff)', fontFamily: "'Vazirmatn', sans-serif" }}>
        <Content style={{ padding: '24px 12px', maxWidth: '800px', margin: '24px auto', width: '100%' }}>
          <Title level={2} style={{ textAlign: 'center', color: '#096dd9', marginBottom: '32px', fontWeight: 'bold' }}>
             لیست وظایف هوشمند با Ant Design و Gemini
          </Title>

          <Card title={<Space><PlusOutlined /> افزودن آیتم جدید</Space>} bordered={false} style={{ marginBottom: '24px', boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}>
            <Form form={form} layout="vertical" onFinish={handleAddTask} name="addTaskForm">
              <Form.Item
                name="taskInput"
                label="عنوان آیتم"
                rules={[{ required: true, message: 'لطفاً عنوان آیتم را وارد کنید!' }]}
              >
                <Input placeholder="مثلاً: نوشتن گزارش هفتگی" size="large" allowClear />
              </Form.Item>
              <Form.Item name="descriptionInput" label="توضیحات (اختیاری)">
                <TextArea rows={2} placeholder="جزئیات بیشتر در مورد آیتم..." size="large" allowClear />
              </Form.Item>
              <Row gutter={[16, 16]} align="middle">
                 <Col xs={24} sm={12}>
                    <Button
                        icon={<RobotOutlined />}
                        onClick={handleGenerateDescription}
                        loading={loadingStates.generatingDescription}
                        style={{ width: '100%' }}
                        size="large"
                        type="dashed"
                    >
                        ✨ تولید توضیحات خودکار
                    </Button>
                 </Col>
                 <Col xs={24} sm={12}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<PlusOutlined />}
                        loading={loadingStates.addingTask}
                        style={{ width: '100%' }}
                        size="large"
                    >
                        افزودن آیتم
                    </Button>
                 </Col>
              </Row>
            </Form>
          </Card>
          
          <Title level={3} style={{ color: '#096dd9', marginTop: '32px', marginBottom: '16px' }}><UnorderedListOutlined style={{marginInlineEnd: 8}} /> لیست آیتم‌ها</Title>
          {tasks.length === 0 && !loadingStates.addingTask ? (
             <Card style={{textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                <Empty description="لیست شما خالی است. یک آیتم جدید اضافه کنید!" />
             </Card>
          ) : (
            <List
              itemLayout="vertical"
              size="large"
              dataSource={tasks}
              renderItem={(task) => (
                <List.Item
                  key={task.id}
                  actions={[
                    <Tooltip title="✨ پیشنهاد وظایfای مرتبط">
                      <Button icon={<BulbOutlined />} onClick={() => openSuggestTasksModalHandler(task)} type="text" shape="circle" style={{color: '#13c2c2', fontSize: '16px'}} />
                    </Tooltip>,
                    <Tooltip title="تجزیه وظیفه با هوش مصنوعی">
                      <Button icon={<ExperimentOutlined />} onClick={() => openBreakdownModalHandler(task)} type="text" shape="circle" style={{color: '#722ed1', fontSize: '16px'}} />
                    </Tooltip>,
                    <Tooltip title="ویرایش آیتم">
                      <Button icon={<EditOutlined />} onClick={() => openEditModal(task)} type="text" shape="circle" style={{color: '#faad14', fontSize: '16px'}} />
                    </Tooltip>,
                    <Tooltip title="حذف آیتم">
                      <Button icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(task.id)} type="text" danger shape="circle" style={{fontSize: '16px'}} />
                    </Tooltip>,
                  ]}
                  style={{ background: '#fff', marginBottom: '12px', borderRadius: '8px', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'box-shadow 0.3s'}}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                >
                  <List.Item.Meta
                    title={<Text strong style={{fontSize: '1.1em', color: '#1f1f1f'}}>{task.text}</Text>}
                    description={task.description ? <Paragraph type="secondary" ellipsis={{ rows: 2, expandable: true, symbol: <Text strong style={{color: '#1890ff'}}>بیشتر</Text> }}>{task.description}</Paragraph> : <Text type="secondary" italic>بدون توضیحات</Text>}
                  />
                </List.Item>
              )}
            />
          )}
        </Content>

        {/* مودال ویرایش آیتم */}
        <Modal
          title={<Space><EditOutlined /> ویرایش آیتم</Space>}
          open={isEditModalOpen}
          onCancel={() => {setIsEditModalOpen(false);}}
          footer={null} 
          centered
          destroyOnClose
          maskClosable={false}
        >
          <Form form={editForm} layout="vertical" onFinish={handleSaveEdit} name="editTaskForm">
            <Form.Item
              name="editTaskInput"
              label="عنوان آیتم"
              rules={[{ required: true, message: 'لطفاً عنوان آیتم را وارد کنید!' }]}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item name="editDescriptionInput" label="توضیحات آیتم">
              <TextArea rows={3} allowClear />
            </Form.Item>
            <Form.Item style={{ textAlign: 'end', marginBottom: 0, marginTop: '24px' }}>
              <Space>
                <Button onClick={() => {setIsEditModalOpen(false);}} icon={<CloseOutlined />}>لغو</Button>
                <Button type="primary" htmlType="submit" loading={loadingStates.editingTask} icon={<SaveOutlined />}>ذخیره تغییرات</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* مودال تجزیه وظیفه */}
        <Modal
          title={<Space><ExperimentOutlined /> تجزیه وظیفه به مراحل</Space>}
          open={isBreakdownModalOpen}
          onCancel={() => setIsBreakdownModalOpen(false)}
          width={600}
          centered
          destroyOnClose
          footer={[
            <Button key="back" onClick={() => setIsBreakdownModalOpen(false)} icon={<CloseOutlined />}>
              بستن
            </Button>,
            currentBrokenDownTasks.length > 0 && !loadingStates.breakingDownTask && (
              <Button key="add" type="primary" onClick={handleAddBrokenDownTasks} icon={<PlusOutlined />} style={{marginRight: 8}}>
                افزودن مراحل به لیست
              </Button>
            ),
          ]}
        >
          {breakdownTask && <Title level={5} style={{marginBottom: 16}}>وظیفه اصلی: <Text strong style={{color: '#096dd9'}}>{breakdownTask.text}</Text></Title>}
          {loadingStates.breakingDownTask ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}><Spin size="large" tip="در حال تجزیه وظیفه توسط هوش مصنوعی..." /></div>
          ) : (
            <div style={{ maxHeight: '300px', overflowY: 'auto', background: '#fafafa', padding: '16px', borderRadius: '4px', border: '1px solid #f0f0f0' }}>
                {breakdownResult || <Empty description="نتیجه‌ای برای نمایش وجود ندارد." />}
            </div>
          )}
        </Modal>

        {/* مودال پیشنهاد وظایف مرتبط */}
        <Modal
          title={<Space><BulbOutlined /> ✨ پیشنهاد وظایف مرتبط</Space>}
          open={isSuggestTasksModalOpen}
          onCancel={() => setIsSuggestTasksModalOpen(false)}
          width={600}
          centered
          destroyOnClose
          footer={[
            <Button key="cancelSuggest" onClick={() => setIsSuggestTasksModalOpen(false)} icon={<CloseOutlined />}>
              لغو
            </Button>,
            suggestedTasks.length > 0 && !loadingStates.suggestingTasks && (
              <Button key="addSuggested" type="primary" onClick={handleAddSelectedSuggestedTasks} icon={<PlusOutlined />} style={{marginRight: 8}} disabled={selectedSuggestedTasks.length === 0}>
                افزودن انتخاب شده‌ها به لیست
              </Button>
            ),
          ]}
        >
          {suggestingForTask && <Title level={5} style={{marginBottom: 16}}>وظیفه اصلی: <Text strong style={{color: '#096dd9'}}>{suggestingForTask.text}</Text></Title>}
          {loadingStates.suggestingTasks ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}><Spin size="large" tip="در حال دریافت پیشنهادات از هوش مصنوعی..." /></div>
          ) : (
            suggestedTasks.length > 0 ? (
              <Checkbox.Group 
                style={{ width: '100%' }} 
                onChange={(checkedValues) => setSelectedSuggestedTasks(checkedValues)}
                value={selectedSuggestedTasks}
              >
                <Space direction="vertical" style={{width: '100%'}}>
                  {suggestedTasks.map(task => (
                    <Checkbox key={task.id} value={task.id} style={{padding: '8px', background: '#f9f9f9', borderRadius: '4px', width: '100%' }}>
                      {task.text}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            ) : (
              <Empty description="پیشنهاد مرتبطی یافت نشد یا خطایی رخ داده است." />
            )
          )}
        </Modal>
      </Layout>
    </ConfigProvider>
  );
}

export default Gemini;
