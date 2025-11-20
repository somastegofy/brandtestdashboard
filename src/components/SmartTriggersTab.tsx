import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Play, 
  Pause, 
  Copy,
  Save,
  Zap,
  BarChart3,
  MapPin,
  Clock,
  Smartphone,
  CloudRain,
  Languages,
  Repeat,
  Image,
  Bell,
  MousePointer,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Monitor,
  Tablet,
  Sun,
  Cloud,
  CloudSnow,
  Wind,
  Thermometer,
  Calendar,
  Users,
  Globe,
  Target,
  Layout,
  Type,
  Link,
  Layers,
  Filter,
  TestTube,
  Activity,
  Lightbulb,
  Workflow
} from 'lucide-react';

interface TriggerCondition {
  id: string;
  type: 'location' | 'time' | 'device' | 'weather' | 'language' | 'repeat-visitor';
  operator: string;
  value: string;
  additionalValue?: string;
}

interface TriggerAction {
  id: string;
  type: 'show-hide' | 'content-variation' | 'popup' | 'change-cta';
  target: string;
  value: string;
  additionalValue?: string;
}

interface TriggerRule {
  id: string;
  name: string;
  pageContext: string;
  status: 'active' | 'inactive' | 'draft';
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  lastModified: string;
  createdAt: string;
  triggerCount: number;
  conversionRate: number;
}

const SmartTriggersTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'analytics'>('rules');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRule, setSelectedRule] = useState<TriggerRule | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);

  // Sample trigger rules data
  const [triggerRules, setTriggerRules] = useState<TriggerRule[]>([
    {
      id: '1',
      name: 'Delhi Morning Offer',
      pageContext: 'Organic Honey Product Page',
      status: 'active',
      conditions: [
        { id: '1', type: 'location', operator: 'equals', value: 'Delhi' },
        { id: '2', type: 'time', operator: 'between', value: '07:00', additionalValue: '11:00' }
      ],
      actions: [
        { id: '1', type: 'show-hide', target: 'morning-offer-banner', value: 'show' }
      ],
      lastModified: '2024-01-20',
      createdAt: '2024-01-15',
      triggerCount: 1247,
      conversionRate: 23.5
    },
    {
      id: '2',
      name: 'Rainy Day Promotion',
      pageContext: 'Global',
      status: 'active',
      conditions: [
        { id: '3', type: 'weather', operator: 'equals', value: 'rainy' }
      ],
      actions: [
        { id: '2', type: 'content-variation', target: 'hero-banner', value: 'rainy-day-banner' },
        { id: '3', type: 'popup', target: 'weather-popup', value: 'Stay cozy with our warm products!' }
      ],
      lastModified: '2024-01-18',
      createdAt: '2024-01-12',
      triggerCount: 892,
      conversionRate: 31.2
    },
    {
      id: '3',
      name: 'Mobile User Experience',
      pageContext: 'Premium Tea Landing Page',
      status: 'draft',
      conditions: [
        { id: '4', type: 'device', operator: 'equals', value: 'mobile' }
      ],
      actions: [
        { id: '4', type: 'change-cta', target: 'main-cta', value: 'Tap to Order Now' }
      ],
      lastModified: '2024-01-22',
      createdAt: '2024-01-20',
      triggerCount: 0,
      conversionRate: 0
    }
  ]);

  // Rule form state
  const [ruleForm, setRuleForm] = useState({
    name: '',
    pageContext: 'global',
    conditions: [] as TriggerCondition[],
    actions: [] as TriggerAction[]
  });

  const conditionTypes = [
    { value: 'location', label: 'Location', icon: MapPin, description: 'City, country, or coordinates' },
    { value: 'time', label: 'Time of Day / Day of Week', icon: Clock, description: 'Specific times or days' },
    { value: 'device', label: 'Device Type', icon: Smartphone, description: 'Mobile, desktop, tablet, OS' },
    { value: 'weather', label: 'Weather', icon: CloudRain, description: 'Weather conditions via API' },
    { value: 'language', label: 'Language', icon: Languages, description: 'Browser or IP-based language' },
    { value: 'repeat-visitor', label: 'Repeat Visitor', icon: Repeat, description: 'Cookie or fingerprint based' }
  ];

  const actionTypes = [
    { value: 'show-hide', label: 'Show/Hide Blocks', icon: Eye, description: 'Toggle visibility of page elements' },
    { value: 'content-variation', label: 'Load Content Variation', icon: Image, description: 'Switch to different content' },
    { value: 'popup', label: 'Trigger Popup/Toast', icon: Bell, description: 'Show notifications or modals' },
    { value: 'change-cta', label: 'Change CTA Text/URL', icon: MousePointer, description: 'Modify button text or links' }
  ];

  const locationOperators = [
    { value: 'equals', label: 'Is' },
    { value: 'not-equals', label: 'Is not' },
    { value: 'contains', label: 'Contains' },
    { value: 'within-radius', label: 'Within radius of' }
  ];

  const timeOperators = [
    { value: 'between', label: 'Between' },
    { value: 'after', label: 'After' },
    { value: 'before', label: 'Before' },
    { value: 'day-of-week', label: 'Day of week' }
  ];

  const deviceOperators = [
    { value: 'equals', label: 'Is' },
    { value: 'not-equals', label: 'Is not' }
  ];

  const weatherConditions = [
    { value: 'sunny', label: 'Sunny', icon: Sun },
    { value: 'cloudy', label: 'Cloudy', icon: Cloud },
    { value: 'rainy', label: 'Rainy', icon: CloudRain },
    { value: 'snowy', label: 'Snowy', icon: CloudSnow },
    { value: 'windy', label: 'Windy', icon: Wind },
    { value: 'hot', label: 'Hot (>30°C)', icon: Thermometer },
    { value: 'cold', label: 'Cold (<10°C)', icon: Thermometer }
  ];

  const deviceTypes = [
    { value: 'mobile', label: 'Mobile' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'ios', label: 'iOS' },
    { value: 'android', label: 'Android' },
    { value: 'windows', label: 'Windows' },
    { value: 'mac', label: 'Mac' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ar', label: 'Arabic' }
  ];

  const pageContexts = [
    'Global',
    'Organic Honey Product Page',
    'Premium Tea Landing Page',
    'Handmade Soap Product Page',
    'Brand Story Landing Page',
    'Eco-Friendly Products'
  ];

  const filteredRules = triggerRules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.pageContext.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || rule.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: Pause },
      draft: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const addCondition = () => {
    const newCondition: TriggerCondition = {
      id: Date.now().toString(),
      type: 'location',
      operator: 'equals',
      value: ''
    };
    setRuleForm({
      ...ruleForm,
      conditions: [...ruleForm.conditions, newCondition]
    });
  };

  const removeCondition = (conditionId: string) => {
    setRuleForm({
      ...ruleForm,
      conditions: ruleForm.conditions.filter(c => c.id !== conditionId)
    });
  };

  const updateCondition = (conditionId: string, updates: Partial<TriggerCondition>) => {
    setRuleForm({
      ...ruleForm,
      conditions: ruleForm.conditions.map(c => 
        c.id === conditionId ? { ...c, ...updates } : c
      )
    });
  };

  const addAction = () => {
    const newAction: TriggerAction = {
      id: Date.now().toString(),
      type: 'show-hide',
      target: '',
      value: ''
    };
    setRuleForm({
      ...ruleForm,
      actions: [...ruleForm.actions, newAction]
    });
  };

  const removeAction = (actionId: string) => {
    setRuleForm({
      ...ruleForm,
      actions: ruleForm.actions.filter(a => a.id !== actionId)
    });
  };

  const updateAction = (actionId: string, updates: Partial<TriggerAction>) => {
    setRuleForm({
      ...ruleForm,
      actions: ruleForm.actions.map(a => 
        a.id === actionId ? { ...a, ...updates } : a
      )
    });
  };

  const handleCreateRule = () => {
    const newRule: TriggerRule = {
      id: Date.now().toString(),
      name: ruleForm.name,
      pageContext: ruleForm.pageContext,
      status: 'draft',
      conditions: ruleForm.conditions,
      actions: ruleForm.actions,
      lastModified: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      triggerCount: 0,
      conversionRate: 0
    };
    
    setTriggerRules([...triggerRules, newRule]);
    setShowCreateModal(false);
    // Reset form
    setRuleForm({
      name: '',
      pageContext: 'global',
      conditions: [],
      actions: []
    });
  };

  const renderConditionInputs = (condition: TriggerCondition) => {
    switch (condition.type) {
      case 'location':
        return (
          <div className="grid grid-cols-2 gap-3">
            <select
              value={condition.operator}
              onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {locationOperators.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={condition.value}
              onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="City, country, or coordinates"
            />
          </div>
        );

      case 'time':
        return (
          <div className="space-y-3">
            <select
              value={condition.operator}
              onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timeOperators.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            {condition.operator === 'between' ? (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  value={condition.value}
                  onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="time"
                  value={condition.additionalValue || ''}
                  onChange={(e) => updateCondition(condition.id, { additionalValue: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ) : condition.operator === 'day-of-week' ? (
              <select
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select day</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            ) : (
              <input
                type="time"
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        );

      case 'device':
        return (
          <div className="grid grid-cols-2 gap-3">
            <select
              value={condition.operator}
              onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {deviceOperators.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
            <select
              value={condition.value}
              onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select device</option>
              {deviceTypes.map(device => (
                <option key={device.value} value={device.value}>{device.label}</option>
              ))}
            </select>
          </div>
        );

      case 'weather':
        return (
          <select
            value={condition.value}
            onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select weather condition</option>
            {weatherConditions.map(weather => (
              <option key={weather.value} value={weather.value}>{weather.label}</option>
            ))}
          </select>
        );

      case 'language':
        return (
          <select
            value={condition.value}
            onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select language</option>
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        );

      case 'repeat-visitor':
        return (
          <select
            value={condition.value}
            onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select visitor type</option>
            <option value="true">Returning visitor</option>
            <option value="false">First-time visitor</option>
          </select>
        );

      default:
        return null;
    }
  };

  const renderActionInputs = (action: TriggerAction) => {
    switch (action.type) {
      case 'show-hide':
        return (
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={action.target}
              onChange={(e) => updateAction(action.id, { target: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Block ID or selector"
            />
            <select
              value={action.value}
              onChange={(e) => updateAction(action.id, { value: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select action</option>
              <option value="show">Show</option>
              <option value="hide">Hide</option>
            </select>
          </div>
        );

      case 'content-variation':
        return (
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={action.target}
              onChange={(e) => updateAction(action.id, { target: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Target element ID"
            />
            <input
              type="text"
              value={action.value}
              onChange={(e) => updateAction(action.id, { value: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Content variation ID"
            />
          </div>
        );

      case 'popup':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={action.target}
              onChange={(e) => updateAction(action.id, { target: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Popup ID"
            />
            <textarea
              value={action.value}
              onChange={(e) => updateAction(action.id, { value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
              placeholder="Message content"
            />
          </div>
        );

      case 'change-cta':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={action.target}
              onChange={(e) => updateAction(action.id, { target: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="CTA element ID"
            />
            <input
              type="text"
              value={action.value}
              onChange={(e) => updateAction(action.id, { value: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="New CTA text"
            />
            <input
              type="url"
              value={action.additionalValue || ''}
              onChange={(e) => updateAction(action.id, { additionalValue: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="New URL (optional)"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const RulesTab = () => (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trigger Rules</h2>
          <p className="text-gray-600">Create personalized experiences based on user context</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search trigger rules..."
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Context</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conditions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                        <div className="text-sm text-gray-500">Modified {rule.lastModified}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{rule.pageContext}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {rule.conditions.slice(0, 2).map((condition, index) => {
                        const conditionType = conditionTypes.find(ct => ct.value === condition.type);
                        const Icon = conditionType?.icon || Target;
                        return (
                          <div key={index} className="flex items-center space-x-2">
                            <Icon className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {conditionType?.label}: {condition.value}
                            </span>
                          </div>
                        );
                      })}
                      {rule.conditions.length > 2 && (
                        <span className="text-xs text-gray-500">+{rule.conditions.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {rule.actions.slice(0, 2).map((action, index) => {
                        const actionType = actionTypes.find(at => at.value === action.type);
                        const Icon = actionType?.icon || MousePointer;
                        return (
                          <div key={index} className="flex items-center space-x-2">
                            <Icon className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {actionType?.label}
                            </span>
                          </div>
                        );
                      })}
                      {rule.actions.length > 2 && (
                        <span className="text-xs text-gray-500">+{rule.actions.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(rule.status)}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">{rule.triggerCount.toLocaleString()} triggers</div>
                      <div className="text-xs text-gray-500">{rule.conversionRate}% conversion</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedRule(rule);
                          setShowTestModal(true);
                        }}
                        className="p-1 hover:bg-blue-100 rounded transition-colors" 
                        title="Test Rule"
                      >
                        <TestTube className="w-4 h-4 text-blue-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Duplicate">
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      {rule.status === 'active' ? (
                        <button className="p-1 hover:bg-yellow-100 rounded transition-colors" title="Pause">
                          <Pause className="w-4 h-4 text-yellow-600" />
                        </button>
                      ) : (
                        <button className="p-1 hover:bg-green-100 rounded transition-colors" title="Activate">
                          <Play className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      <button className="p-1 hover:bg-red-100 rounded transition-colors text-red-500" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Examples */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Trigger Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Location + Time</h4>
                <p className="text-sm text-gray-600 mb-2">IF [Location = Mumbai] AND [Time = 6-9 PM]</p>
                <p className="text-sm text-blue-600">→ Show "Evening Delivery Available" banner</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Weather + Device</h4>
                <p className="text-sm text-gray-600 mb-2">IF [Weather = Hot] AND [Device = Mobile]</p>
                <p className="text-sm text-blue-600">→ Show "Cool Drinks" popup</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Language + Visitor</h4>
                <p className="text-sm text-gray-600 mb-2">IF [Language = Hindi] AND [Repeat Visitor = True]</p>
                <p className="text-sm text-blue-600">→ Change CTA to "फिर से ऑर्डर करें"</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Time-based Content</h4>
                <p className="text-sm text-gray-600 mb-2">IF [Day = Weekend] AND [Time = Morning]</p>
                <p className="text-sm text-blue-600">→ Load "Weekend Special" content variation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Smart Triggers Analytics</h2>
        <p className="text-gray-600">Monitor performance and effectiveness of your trigger rules</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +18%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">2,139</h3>
          <p className="text-gray-600">Total Triggers</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">27.3%</h3>
          <p className="text-gray-600">Avg Conversion Rate</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
          <p className="text-gray-600">Active Rules</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-1" />
              +25%
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">1,847</h3>
          <p className="text-gray-600">Unique Users Affected</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trigger Performance Over Time</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Performance analytics chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Top Performing Rules */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Rules</h3>
        <div className="space-y-4">
          {triggerRules.filter(r => r.status === 'active').map((rule, index) => (
            <div key={rule.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-700">#{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{rule.name}</h4>
                  <p className="text-sm text-gray-500">{rule.triggerCount.toLocaleString()} triggers</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">{rule.conversionRate}%</div>
                <div className="text-sm text-gray-500">Conversion</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Condition Type Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Condition Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conditionTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.value} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-gray-900">{type.label}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Triggers</span>
                    <span className="font-medium">
                      {Math.floor(Math.random() * 1000) + 100}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Conversion</span>
                    <span className="font-medium text-green-600">
                      {(Math.random() * 30 + 10).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Triggers</h1>
        <p className="text-gray-600">Create personalized, context-aware experiences with IF/THEN logic</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'rules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Workflow className="w-4 h-4 inline mr-2" />
              Trigger Rules ({triggerRules.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'rules' ? <RulesTab /> : <AnalyticsTab />}

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Trigger Rule</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rule Name</label>
                    <input
                      type="text"
                      value={ruleForm.name}
                      onChange={(e) => setRuleForm({...ruleForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter rule name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Context</label>
                    <select
                      value={ruleForm.pageContext}
                      onChange={(e) => setRuleForm({...ruleForm, pageContext: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {pageContexts.map(context => (
                        <option key={context.toLowerCase().replace(/\s+/g, '-')} value={context.toLowerCase().replace(/\s+/g, '-')}>
                          {context}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* IF Conditions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold text-gray-900">IF Conditions</h4>
                  <button
                    onClick={addCondition}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Condition
                  </button>
                </div>

                {ruleForm.conditions.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No conditions added yet. Click "Add Condition" to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ruleForm.conditions.map((condition, index) => {
                      const conditionType = conditionTypes.find(ct => ct.value === condition.type);
                      const Icon = conditionType?.icon || Target;
                      
                      return (
                        <div key={condition.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mt-1">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {index > 0 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                                      AND
                                    </span>
                                  )}
                                  <select
                                    value={condition.type}
                                    onChange={(e) => updateCondition(condition.id, { 
                                      type: e.target.value as TriggerCondition['type'],
                                      operator: 'equals',
                                      value: ''
                                    })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    {conditionTypes.map(type => (
                                      <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  onClick={() => removeCondition(condition.id)}
                                  className="p-1 hover:bg-red-100 rounded text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              {renderConditionInputs(condition)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* THEN Actions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold text-gray-900">THEN Actions</h4>
                  <button
                    onClick={addAction}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Action
                  </button>
                </div>

                {ruleForm.actions.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <MousePointer className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No actions added yet. Click "Add Action" to start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ruleForm.actions.map((action, index) => {
                      const actionType = actionTypes.find(at => at.value === action.type);
                      const Icon = actionType?.icon || MousePointer;
                      
                      return (
                        <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mt-1">
                              <Icon className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <select
                                  value={action.type}
                                  onChange={(e) => updateAction(action.id, { 
                                    type: e.target.value as TriggerAction['type'],
                                    target: '',
                                    value: ''
                                  })}
                                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {actionTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => removeAction(action.id)}
                                  className="p-1 hover:bg-red-100 rounded text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              {renderActionInputs(action)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRule}
                disabled={!ruleForm.name || ruleForm.conditions.length === 0 || ruleForm.actions.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Rule Modal */}
      {showTestModal && selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Test Rule: {selectedRule.name}</h3>
                <button
                  onClick={() => setShowTestModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <TestTube className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Rule Testing</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Simulate different environments to test how your rule behaves under various conditions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Location</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="delhi">Delhi</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="chennai">Chennai</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Time</label>
                  <input
                    type="time"
                    defaultValue="09:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Device</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Weather</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="sunny">Sunny</option>
                    <option value="rainy">Rainy</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Test Result</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700">Rule conditions would be met</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">Actions would be triggered</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowTestModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <TestTube className="w-4 h-4 mr-2" />
                Run Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartTriggersTab;