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
  Timeline,
  Table,
  Progress,
  Statistic,
  Descriptions,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  SendOutlined,
  RobotOutlined,
  DatabaseOutlined,
  ApiOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  BarChartOutlined,
  TrophyOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [pipelineData, setPipelineData] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('query');

  const handleQuery = async () => {
    if (!query.trim()) {
      message.error('Please enter a query');
      return;
    }
    setLoading(true);
    setResult(null);
    setPipelineData(null);
    try {
      const response = await axios.post('http://192.168.0.28:8000/classify', {
        text: query.trim(),
        confidence_threshold: 0.3,
        search_limit: 3,
        use_local_llm: true
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

  const handleEvaluationResults = async () => {
    setEvaluationLoading(true);
    try {
      const response = await axios.get('http://192.168.0.28:8000/evaluation/results');
      setEvaluationResults(response.data);
      message.success('Evaluation results loaded successfully!');
    } catch (err) {
      console.error('Evaluation error:', err);
      message.error('Failed to load evaluation results. Please try again.');
    } finally {
      setEvaluationLoading(false);
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
          title: 'Detected Labels',
          status: 'processing',
          icon: <DatabaseOutlined style={{ color: '#52c41a' }} />,
          content: (
            <div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Using zero-shot classification (facebook/bart-large-mnli)
                </Text>
              </div>
              {data.detected_labels && Object.entries(data.detected_labels).map(([label, score]) => (
                <Tag key={label} color={score > 0.3 ? 'red' : 'default'} style={{ marginBottom: 4 }}>
                  {label}: {score.toFixed(2)}
                </Tag>
              ))}
            </div>
          ),
          duration: '',
        },
        {
          key: '3',
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
          key: '4',
          title: 'Rule-based/LLM Analysis',
          status: 'success',
          icon: <BulbOutlined style={{ color: '#faad14' }} />,
          content: (
            <div>
              <div style={{ marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Using distilgpt2 model for analysis
                </Text>
              </div>
              <div style={{ marginBottom: 4 }}>
                <Text strong>Classification:</Text> {data.llm_response?.classification || 'N/A'}
              </div>
              <div style={{ fontSize: 13, color: '#888' }}>
                <span>Classification: {data.llm_response?.classification}</span> |{' '}
                <span>Confidence: {data.llm_response?.confidence}</span>
              </div>
            </div>
          ),
          duration: '',
        },
        {
          key: '5',
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

  const renderEvaluationResults = () => {
    if (!evaluationResults) return null;

    const { overall_performance, f1_metrics_table, detailed_results_table, metadata, label_distribution } = evaluationResults;

    // F1 Metrics Table columns
    const f1Columns = [
      {
        title: 'Label',
        dataIndex: 'label',
        key: 'label',
        render: (text) => <Tag color="blue">{text}</Tag>
      },
      {
        title: 'Precision',
        dataIndex: 'precision',
        key: 'precision',
        render: (value) => <Text strong>{(value * 100).toFixed(1)}%</Text>
      },
      {
        title: 'Recall',
        dataIndex: 'recall',
        key: 'recall',
        render: (value) => <Text strong>{(value * 100).toFixed(1)}%</Text>
      },
      {
        title: 'F1 Score',
        dataIndex: 'f1_score',
        key: 'f1_score',
        render: (value) => (
          <Tag color={value > 0.5 ? 'green' : value > 0.2 ? 'orange' : 'red'}>
            {(value * 100).toFixed(1)}%
          </Tag>
        )
      },
      {
        title: 'Support',
        dataIndex: 'support',
        key: 'support',
        render: (value) => <Text>{value}</Text>
      }
    ];

    // Detailed Results Table columns
    const detailedColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 60
      },
      {
        title: 'Text',
        dataIndex: 'text',
        key: 'text',
        render: (text) => <Text style={{ fontSize: '12px' }}>{text.substring(0, 100)}...</Text>
      },
      {
        title: 'Ground Truth',
        dataIndex: 'ground_truth',
        key: 'ground_truth',
        render: (text) => <Tag color={text === 'offensive' ? 'red' : 'green'}>{text}</Tag>
      },
      {
        title: 'Predicted',
        dataIndex: 'predicted',
        key: 'predicted',
        render: (text) => <Tag color={text === 'offensive' ? 'red' : 'green'}>{text}</Tag>
      },
      {
        title: 'Correct',
        dataIndex: 'correct',
        key: 'correct',
        render: (correct) => <Tag color={correct ? 'green' : 'red'}>{correct ? '✓' : '✗'}</Tag>
      },
      {
        title: 'Confidence',
        dataIndex: 'confidence',
        key: 'confidence',
        render: (text) => <Tag color={text === 'high' ? 'green' : 'orange'}>{text}</Tag>
      }
    ];

    return (
      <div style={{ padding: '24px 0' }}>
        {/* Overall Performance Metrics */}
        <Card title="Overall Performance Metrics" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Accuracy"
                value={overall_performance.accuracy * 100}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
                prefix={<TrophyOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Precision"
                value={overall_performance.precision * 100}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
                prefix={<BarChartOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Recall"
                value={overall_performance.recall * 100}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
                prefix={<InfoCircleOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="F1 Score"
                value={overall_performance.f1_score * 100}
                suffix="%"
                valueStyle={{ color: '#faad14' }}
                prefix={<CheckCircleOutlined />}
              />
            </Col>
          </Row>
          <Divider />
          <Row gutter={16}>
            <Col span={8}>
              <Text>Correct Predictions: <Text strong>{overall_performance.correct_predictions}</Text></Text>
            </Col>
            <Col span={8}>
              <Text>Incorrect Predictions: <Text strong>{overall_performance.incorrect_predictions}</Text></Text>
            </Col>
            <Col span={8}>
              <Text>Success Rate: <Text strong>{overall_performance.success_rate}%</Text></Text>
            </Col>
          </Row>
        </Card>

        {/* F1 Metrics Table */}
        <Card title="F1 Metrics by Label" style={{ marginBottom: 24 }}>
          <Table
            dataSource={f1_metrics_table}
            columns={f1Columns}
            pagination={false}
            size="small"
            rowKey="label"
          />
        </Card>

        {/* Label Distribution */}
        <Card title="Label Distribution" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            {Object.entries(label_distribution).map(([label, data]) => (
              <Col span={8} key={label} style={{ marginBottom: 16 }}>
                <Card size="small">
                  <Text strong style={{ textTransform: 'capitalize' }}>{label}</Text>
                  <br />
                  <Text type="secondary">Count: {data.count}</Text>
                  <br />
                  <Progress percent={data.percentage} size="small" />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Detailed Results Table */}
        <Card title="Detailed Test Results">
          <Table
            dataSource={detailed_results_table}
            columns={detailedColumns}
            pagination={{ pageSize: 10 }}
            size="small"
            rowKey="id"
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
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
          <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ background: 'white', padding: '24px', borderRadius: '16px' }}>
            <TabPane tab="Query Pipeline" key="query">
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
            </TabPane>

            <TabPane tab="Evaluation Results" key="evaluation">
              <Card>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <Title level={3}>
                    <BarChartOutlined /> Model Evaluation Results
                  </Title>
                  <Paragraph>
                    Comprehensive F1-score evaluation and performance metrics for the offensive language detection model
                  </Paragraph>
                  <Button
                    type="primary"
                    icon={<BarChartOutlined />}
                    onClick={handleEvaluationResults}
                    loading={evaluationLoading}
                    size="large"
                  >
                    {evaluationLoading ? 'Loading Results...' : 'Load Evaluation Results'}
                  </Button>
                </div>

                {evaluationResults && renderEvaluationResults()}
              </Card>
            </TabPane>
          </Tabs>
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