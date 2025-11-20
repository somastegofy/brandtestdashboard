import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon,
  Plus,
  RefreshCw,
  Download,
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Phone,
  Mail,
  MessageCircle,
  Video,
  Share2,
  FileText,
  Zap,
  Eye,
  UserCheck,
  Target,
  Activity,
  Headphones
} from 'lucide-react';
import TicketsList from './support_inbox/TicketsList';
import TicketDetailPanel from './support_inbox/TicketDetailPanel';
import VideoSupportTab from './support_inbox/VideoSupportTab';
import FormsBookingsTab from './support_inbox/FormsBookingsTab';
import SocialMonitoringTab from './support_inbox/SocialMonitoringTab';
import SupportSettingsTab from './support_inbox/SupportSettingsTab';
import SupportAnalyticsTab from './support_inbox/SupportAnalyticsTab';
import AgentPresenceWidget from './support_inbox/AgentPresenceWidget';
import VideoBookingModal from './support_inbox/VideoBookingModal';
import { 
  Ticket, 
  Customer, 
  Agent, 
  VideoBooking, 
  ConversationMessage, 
  SocialMention,
  SAMPLE_TICKETS, 
  SAMPLE_CUSTOMERS, 
  SAMPLE_AGENTS, 
  SAMPLE_VIDEO_BOOKINGS,
  SAMPLE_CONVERSATION_MESSAGES,
  SAMPLE_SOCIAL_MENTIONS
} from '../types/supportTypes';

const SupportInboxTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'video-support' | 'forms-bookings' | 'social-monitoring' | 'settings' | 'analytics'>('inbox');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showVideoBookingModal, setShowVideoBookingModal] = useState(false);
  
  // Data states
  const [tickets, setTickets] = useState<Ticket[]>(SAMPLE_TICKETS);
  const [customers] = useState<Customer[]>(SAMPLE_CUSTOMERS);
  const [agents] = useState<Agent[]>(SAMPLE_AGENTS);
  const [videoBookings, setVideoBookings] = useState<VideoBooking[]>(SAMPLE_VIDEO_BOOKINGS);
  const [conversationMessages] = useState<ConversationMessage[]>(SAMPLE_CONVERSATION_MESSAGES);
  const [socialMentions] = useState<SocialMention[]>(SAMPLE_SOCIAL_MENTIONS);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [dateRange, setDateRange] = useState('last-7-days');

  // Filter tickets based on current filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customers.find(c => c.id === ticket.customerId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesChannel = selectedChannel === 'all' || ticket.channel === selectedChannel;
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    const matchesAgent = selectedAgent === 'all' || ticket.assignedTo === selectedAgent;
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority;
    
    return matchesSearch && matchesChannel && matchesStatus && matchesAgent && matchesPriority;
  });

  // Calculate analytics
  const totalTickets = tickets.length;
  const newTickets = tickets.filter(t => t.status === 'new').length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const escalatedTickets = tickets.filter(t => t.status === 'escalated').length;
  const slaBreaches = tickets.filter(t => t.slaBreachAt && new Date(t.slaBreachAt) < new Date()).length;
  const unreadTickets = tickets.filter(t => !t.isRead).length;

  // Online agents
  const onlineAgents = agents.filter(a => a.availabilityStatus === 'online').length;

  // Handle ticket selection
  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    
    // Mark ticket as read
    if (!ticket.isRead) {
      setTickets(prev => prev.map(t => 
        t.id === ticket.id ? { ...t, isRead: true } : t
      ));
    }
  };

  // Handle ticket updates
  const handleTicketUpdate = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => 
      t.id === updatedTicket.id ? updatedTicket : t
    ));
    setSelectedTicket(updatedTicket);
  };

  // Handle video booking creation
  const handleCreateVideoBooking = (bookingData: Omit<VideoBooking, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBooking: VideoBooking = {
      ...bookingData,
      id: `VB-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setVideoBookings(prev => [...prev, newBooking]);
    setShowVideoBookingModal(false);
  };

  const subTabs = [
    { id: 'inbox', label: 'Support Inbox', icon: MessageSquare, count: totalTickets },
    { id: 'video-support', label: 'Video Support', icon: Video, count: videoBookings.filter(vb => vb.status === 'scheduled').length },
    { id: 'forms-bookings', label: 'Forms & Bookings', icon: FileText, count: tickets.filter(t => t.channel === 'form').length },
    { id: 'social-monitoring', label: 'Social Monitoring', icon: Share2, count: socialMentions.filter(sm => !sm.isConverted).length },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, count: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: null }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'video-support':
        return (
          <VideoSupportTab 
            videoBookings={videoBookings}
            agents={agents}
            customers={customers}
            onBookingUpdate={(booking) => {
              setVideoBookings(prev => prev.map(vb => 
                vb.id === booking.id ? booking : vb
              ));
            }}
          />
        );
      case 'forms-bookings':
        return (
          <FormsBookingsTab 
            tickets={tickets.filter(t => t.channel === 'form')}
            customers={customers}
            onTicketUpdate={handleTicketUpdate}
          />
        );
      case 'social-monitoring':
        return (
          <SocialMonitoringTab 
            socialMentions={socialMentions}
            onConvertToTicket={(mention) => {
              // Convert social mention to ticket
              const newTicket: Ticket = {
                id: `TKT-${Date.now()}`,
                channel: 'social',
                status: 'new',
                priority: mention.sentiment === 'negative' ? 'high' : 'medium',
                subject: `Social mention from ${mention.platform}`,
                description: mention.content,
                productId: mention.productId,
                productName: mention.productName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                customerId: `cust-social-${Date.now()}`,
                tags: ['social-media', mention.platform, mention.sentiment],
                sourceDetail: { socialLink: mention.link },
                isRead: false,
                attachments: [],
                conversationPreview: mention.content.substring(0, 100) + '...'
              };
              setTickets(prev => [newTicket, ...prev]);
            }}
          />
        );
      case 'settings':
        return <SupportSettingsTab agents={agents} />;
      case 'analytics':
        return (
          <SupportAnalyticsTab 
            tickets={tickets}
            videoBookings={videoBookings}
            agents={agents}
          />
        );
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Tickets List */}
            <div className="lg:col-span-1">
              <TicketsList
                tickets={filteredTickets}
                customers={customers}
                agents={agents}
                selectedTicket={selectedTicket}
                onTicketSelect={handleTicketSelect}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />
            </div>
            
            {/* Ticket Detail Panel */}
            <div className="lg:col-span-2">
              <TicketDetailPanel
                ticket={selectedTicket}
                customer={selectedTicket ? customers.find(c => c.id === selectedTicket.customerId) : null}
                agent={selectedTicket?.assignedTo ? agents.find(a => a.id === selectedTicket.assignedTo) : null}
                conversationMessages={conversationMessages.filter(m => m.ticketId === selectedTicket?.id)}
                onTicketUpdate={handleTicketUpdate}
                onCreateVideoBooking={() => setShowVideoBookingModal(true)}
                agents={agents}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
            Support Center
          </h1>
          <p className="text-gray-600">Centralized multi-channel customer support management</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button
            onClick={() => setShowVideoBookingModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Video className="w-4 h-4 mr-2" />
            Schedule Call
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex items-center text-green-600 text-xs font-medium">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12%
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{totalTickets}</h3>
          <p className="text-xs text-gray-600">Total Tickets</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{newTickets}</h3>
          <p className="text-xs text-gray-600">New</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{pendingTickets}</h3>
          <p className="text-xs text-gray-600">Pending</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{inProgressTickets}</h3>
          <p className="text-xs text-gray-600">In Progress</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{resolvedTickets}</h3>
          <p className="text-xs text-gray-600">Resolved</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{escalatedTickets}</h3>
          <p className="text-xs text-gray-600">Escalated</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{slaBreaches}</h3>
          <p className="text-xs text-gray-600">SLA Breaches</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{onlineAgents}</h3>
          <p className="text-xs text-gray-600">Agents Online</p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200 p-1">
        <div className="flex space-x-1 overflow-x-auto">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Filters (only show for inbox tab) */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search tickets..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Channels</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="video">Video</option>
                <option value="chat">Live Chat</option>
                <option value="form">Forms</option>
                <option value="social">Social Media</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
                <option value="spam">Spam</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Agent</label>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Agents</option>
                <option value="">Unassigned</option>
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="today">Today</option>
                <option value="last-7-days">Last 7 days</option>
                <option value="last-30-days">Last 30 days</option>
                <option value="last-90-days">Last 90 days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Agent Presence Widget (only show for inbox tab) */}
      {activeTab === 'inbox' && (
        <AgentPresenceWidget agents={agents} />
      )}

      {/* Main Content */}
      {renderContent()}

      {/* Video Booking Modal */}
      <VideoBookingModal
        isOpen={showVideoBookingModal}
        onClose={() => setShowVideoBookingModal(false)}
        onSave={handleCreateVideoBooking}
        agents={agents}
        customers={customers}
        selectedTicket={selectedTicket}
      />
    </div>
  );
};

export default SupportInboxTab;