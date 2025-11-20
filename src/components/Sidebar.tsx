import React from 'react';
import {
  LayoutDashboard,
  Package,
  Palette,
  BarChart3,
  QrCode,
  Users,
  MessageCircle,
  Settings,
  Gift,
  Zap,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Star,
  Files
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'studio', label: 'Studio', icon: Palette },
  { id: 'rewards-campaigns', label: 'Rewards & Campaigns', icon: Gift },
  { id: 'smart-triggers', label: 'Smart Triggers', icon: Zap },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'qr-codes', label: 'QR Codes', icon: QrCode },
  { id: 'buyer-source-proof', label: 'Buyer Source & Proof', icon: Receipt },
  { id: 'consumers', label: 'Consumers', icon: Users },
  { id: 'reviews-manager', label: 'Reviews Manager', icon: Star },
  { id: 'support', label: 'Support Inbox', icon: MessageCircle },
  { id: 'files', label: 'File Manager', icon: Files },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isCollapsed, onToggleCollapse }) => {
  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900">Stegofy</span>
          )}
        </div>
      </div>
      
      <nav className="mt-6 flex-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center ${isCollapsed ? 'px-4 justify-center' : 'px-6'} py-3 text-left transition-all duration-200 hover:bg-gray-50 ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Toggle Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;