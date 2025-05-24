
import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardBuilder } from '@/components/admin/DashboardBuilder';
import { ReportBuilder } from '@/components/admin/ReportBuilder';
import { AlertBuilder } from '@/components/admin/AlertBuilder';
import { MobilePreview } from '@/components/admin/MobilePreview';
import { DashboardList } from '@/components/admin/DashboardList';

export type AdminView = 'dashboards' | 'dashboard-builder' | 'report-builder' | 'alert-builder' | 'preview';

const Index = () => {
  const [activeView, setActiveView] = useState<AdminView>('dashboards');
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex w-full">
      <AdminSidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        selectedDashboard={selectedDashboard}
      />
      
      <main className="flex-1 overflow-hidden">
        {activeView === 'dashboards' && (
          <DashboardList 
            onCreateDashboard={() => setActiveView('dashboard-builder')}
            onEditDashboard={(id) => {
              setSelectedDashboard(id);
              setActiveView('dashboard-builder');
            }}
          />
        )}
        
        {activeView === 'dashboard-builder' && (
          <DashboardBuilder 
            dashboardId={selectedDashboard}
            onAddReport={() => setActiveView('report-builder')}
            onPreview={() => setActiveView('preview')}
          />
        )}
        
        {activeView === 'report-builder' && (
          <ReportBuilder 
            onSave={() => setActiveView('dashboard-builder')}
            onPreview={() => setActiveView('preview')}
          />
        )}
        
        {activeView === 'alert-builder' && (
          <AlertBuilder 
            onSave={() => setActiveView('dashboard-builder')}
          />
        )}
        
        {activeView === 'preview' && (
          <MobilePreview 
            onBack={() => setActiveView('dashboard-builder')}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
