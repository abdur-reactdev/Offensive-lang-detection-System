import React, { useState } from 'react';
import {
  Layout,
  Typography,
  Card,
  Input,
  Button,
  Space,
  message,
  Spin,
  Tree,
  Row,
  Col,
  Tag,
  Divider,
  Timeline
} from 'antd';
import {
  SearchOutlined,
  SendOutlined,
  RobotOutlined,
  DatabaseOutlined,
  ApiOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [pipelineData, setPipelineData] = useState(null);

  const handleQuery = async () => {
    if (!query.trim()) {
      message.error('Please enter a query');
      return;
    }
    setLoading(true);
    setResult(null);
    setPipelineData(null);
    try {
      const response = await axios.post('/query', {
        text: query.trim()
      });
      setResult(response.data);
      // Generate pipeline data for visualization using real API response
      const pipeline = generatePipelineData(response.data);
      setPipelineData(pipeline);
      message.success('Query processed successfully!');
    } catch (err) {
      console.error('Query error:', err);
      message.error('Query failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate pipeline steps from real API response
  const generatePipelineData = (data) => {
    return {
      steps: [
        {
          key: '1',
          title: 'User Input',
          status: 'info',
          icon: <RobotOutlined style={{ color: '#1890ff' }} />,
          content: (
            <Paragraph style={{ marginBottom: 0 }}>
              <Text strong>Input:</Text> {data.user_input}
            </Paragraph>
          ),
          duration: '',
        },
        {
          key: '2',
          title: 'Similar Example Retrieval',
          status: 'processing',
          icon: <DatabaseOutlined style={{ color: '#722ed1' }} />,
          content: (
            <div>
              {data.search_results && data.search_results.length > 0 ? (
                data.search_results.map((item, idx) => (
                  <Card key={idx} size="small" className="rag-item" style={{ marginBottom: 8 }}>
                    <div style={{ marginBottom: 4 }}>
                      <Text strong>Rank {item.rank}:</Text> <Text>{item.text}</Text>
                    </div>
                    <div style={{ fontSize: 13, color: '#888' }}>
                      <span>Similarity: {(item.similarity_score * 100).toFixed(1)}%</span> |{' '}
                      <span>Primary Emotion: {item.primary_emotion}</span> |{' '}
                      <span>Toxicity Score: {(item.toxicity_score * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      {Object.entries(item.labels).map(([label, val]) => (
                        <Tag key={label} color={val ? 'red' : 'default'}>{label}: {val}</Tag>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <Text type="secondary">No similar examples found.</Text>
              )}
            </div>
          ),
          duration: '',
        },
        {
          key: '3',
          title: 'Rule-based/LLM Analysis',
          status: 'success',
          icon: <BulbOutlined style={{ color: '#faad14' }} />,
          content: (
            <div>
              <div style={{ marginBottom: 4 }}>
                <Text strong>Classification:</Text> {data.llm_response?.classification || 'N/A'}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>
                <span>Analysis Type: {data.llm_response?.analysis_type}</span> |{' '}
                <span>Toxicity Ratio: {data.llm_response?.toxicity_ratio}</span> |{' '}
                <span>Offensive Words: {data.llm_response?.user_offensive_words}</span> |{' '}
                <span>Confidence: {data.llm_response?.confidence}</span>
              </div>
            </div>
          ),
          duration: '',
        },
        {
          key: '4',
          title: 'Final Decision',
          status: data.llm_response?.classification === 'offensive' ? 'error' : 'success',
          icon: data.llm_response?.classification === 'offensive' ? <ApiOutlined style={{ color: '#ff4d4f' }} /> : <ApiOutlined style={{ color: '#52c41a' }} />,
          content: (
            <div>
              <div style={{ marginBottom: 4 }}>
                <Text strong>Detected Labels:</Text>
                {data.detected_labels && Object.entries(data.detected_labels).map(([label, score]) => (
                  <Tag key={label} color={score > 0.3 ? 'red' : 'default'}>{label}: {score.toFixed(2)}</Tag>
                ))}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>
                <span>Classification: {data.llm_response?.classification}</span> |{' '}
                <span>Confidence: {data.llm_response?.confidence}</span>
              </div>
            </div>
          ),
          duration: '',
        },
      ]
    };
  };

  const clearQuery = () => {
    setQuery('');
    setResult(null);
    setPipelineData(null);
  };

  const renderPipelineStep = (step) => {
    return (
      <Card 
        key={step.key}
        className="pipeline-step-card"
        size="small"
        style={{ marginBottom: 16 }}
      >
        <div className="step-header">
          <Space>
            {step.icon}
            <Title level={5} style={{ margin: 0 }}>
              {step.title}
            </Title>
            <Tag color={step.status === 'success' ? 'green' : 'blue'}>
              {step.duration}
            </Tag>
          </Space>
        </div>
        
        <div className="step-content">
          {Array.isArray(step.content) ? (
            <div>
              {step.content.map((item, index) => (
                <div key={index} className="rag-item">
                  <Text type="secondary">• {item}</Text>
                </div>
              ))}
            </div>
          ) : (
            <Paragraph style={{ marginBottom: 0 }}>
              {step.content}
            </Paragraph>
          )}
        </div>
      </Card>
    );
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-content">
          <RobotOutlined className="header-icon" />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            RAG Pipeline Visualization
          </Title>
        </div>
      </Header>

      <Content className="app-content">
        <div className="content-container">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Card className="query-card">
                <div className="query-section">
                  <Title level={4} className="query-title">
                    <SearchOutlined /> Ask Your Question
                  </Title>
                  
                  <TextArea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your query here..."
                    rows={4}
                    className="query-input"
                    showCount
                    maxLength={500}
                  />

                  <Space className="button-group">
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleQuery}
                      loading={loading}
                      size="large"
                      className="query-button"
                    >
                      {loading ? 'Processing...' : 'Send Query'}
                    </Button>
                    <Button
                      onClick={clearQuery}
                      size="large"
                    >
                      Clear
                    </Button>
                  </Space>
                </div>

                {loading && (
                  <div className="loading-section">
                    <Spin size="large" />
                    <Text className="loading-text">Processing your query through the RAG pipeline...</Text>
                  </div>
                )}
              </Card>
            </Col>

            <Col xs={24} lg={16}>
              <Card className="pipeline-card">
                <Title level={4} className="pipeline-title">
                  <DatabaseOutlined /> RAG Pipeline Flow
                </Title>
                
                {pipelineData ? (
                  <div className="pipeline-container">
                    <div className="pipeline-timeline">
                      {pipelineData.steps.map((step, index) => (
                        <div key={step.key} className="timeline-item">
                          <div className="timeline-marker">
                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
                          </div>
                          <div className="timeline-content">
                            {renderPipelineStep(step)}
                          </div>
                          {index < pipelineData.steps.length - 1 && (
                            <div className="timeline-connector" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="empty-pipeline">
                    <DatabaseOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                      Send a query to see the RAG pipeline in action
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      <Footer className="app-footer">
        <Text type="secondary">
          RAG Pipeline Visualization ©2024
        </Text>
      </Footer>
    </Layout>
  );
}

export default App;