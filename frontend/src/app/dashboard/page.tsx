'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/atoms/Button';
import { MetricCard } from '@/components/molecules/MetricCard';
import { WellnessChart } from '@/components/organisms/WellnessChart';
import { DataEntryModal, MetricType } from '@/components/organisms/DataEntryModal';
import { wellnessService } from '@/services/wellnessService';

export default function DashboardPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>({ hydration: [], nutrition: [], exercises: [], journals: [] });
  const [externalData, setExternalData] = useState<any>(null);
  
  // States for interactive UI elements
  const [isSyncing, setIsSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/');
    } else {
      setAuthorized(true);
      loadDashboardData();
    }
  }, [router]);

  /**
   * Fetches all database metrics from the backend.
   */
  const loadDashboardData = async () => {
    try {
      const data = await wellnessService.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Triggers the external API proxy to fetch steps and sleep data.
   */
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const data = await wellnessService.getExternalData();
      setExternalData(data);
    } catch (error) {
      console.error('Error syncing external data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  /**
   * Handles form submission from the universal modal.
   * Routes the payload to the correct POST endpoint based on the metric type.
   */
  const handleDataSubmit = async (type: MetricType, value: string | number) => {
    try {
      // Get today's date formatted as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      
      switch (type) {
        case 'water':
          await wellnessService.addHydration(Number(value), today);
          break;
        case 'calories':
          await wellnessService.addNutrition(Number(value), today);
          break;
        case 'exercise':
          await wellnessService.addExercise(Number(value), today);
          break;
        case 'journal':
          await wellnessService.addJournal(String(value), today);
          break;
      }
      
      // Reload dashboard metrics to visually update the UI
      await loadDashboardData();
    } catch (error) {
      console.error(`Error saving ${type} data:`, error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  if (!authorized || loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Data processing for UI rendering
  const totalCalories = metrics.nutrition?.reduce((acc: number, curr: any) => acc + curr.calories, 0) || 0;
  const totalGlasses = metrics.hydration?.reduce((acc: number, curr: any) => acc + curr.glasses, 0) || 0;
  const waterLiters = (totalGlasses * 0.25).toFixed(1);
  
  // Calculate total exercise minutes and get the latest 3 journal entries
  const totalExercise = metrics.exercises?.reduce((acc: number, curr: any) => acc + curr.duration, 0) || 0;
  const recentJournals = metrics.journals?.slice(-3).reverse() || []; 

  // Process data for the Chart.js integration
  const chartLabels = metrics.hydration?.map((h: any) => h.date.split('T')[0]).slice(-7).reverse() || [];
  const chartData = metrics.hydration?.map((h: any) => h.glasses * 0.25).slice(-7).reverse() || [];

  return (
    <div className="container py-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="fw-bold text-dark mb-1">Health Dashboard</h1>
          <p className="text-muted mb-0">Overview of your Zealthy follow-up.</p>
        </div>
        <div className="d-flex gap-2">
          {/* Button to trigger the universal entry modal */}
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            + Add Record
          </Button>
          <Button variant="outline-primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="row mb-4">
        <MetricCard title="Water Consumed" value={waterLiters} unit="L" icon="💧" colorClass="text-info" />
        <MetricCard title="Calories Consumed" value={totalCalories} unit="kcal" icon="🍎" colorClass="text-danger" />
        <MetricCard title="Exercise Duration" value={totalExercise} unit="min" icon="⏱️" colorClass="text-warning" />
        <MetricCard title="Hours of Sleep" value={externalData?.sleep || "---"} unit="hrs" icon="🌙" colorClass="text-primary" />
        <MetricCard title="Daily Steps" value={externalData?.steps || "---"} unit="passos" icon="👟" colorClass="text-success" />
      </div>

      <div className="row mt-4">
        <div className="col-12 col-lg-8 mb-4">
          <WellnessChart 
            title="Hydration History"
            labels={chartLabels.length > 0 ? chartLabels : ['No Data']}
            dataValues={chartData.length > 0 ? chartData : [0]}
            labelName="Liters Consumed"
            borderColor="rgba(13, 202, 240, 1)"
            backgroundColor="rgba(13, 202, 240, 0.1)"
          />
        </div>
        
        <div className="col-12 col-lg-4 mb-4 d-flex flex-column gap-4">
          {/* External Sync Card */}
          <div className="card shadow-sm border-0 p-4 bg-white bg-opacity-75 text-center" style={{ backdropFilter: 'blur(10px)', borderRadius: '1rem' }}>
            <h5 className="fw-bold text-secondary mb-3">External Synchronization</h5>
            <p className="text-muted small">Look for consolidated data</p>
            <Button variant="primary" className="mt-2" onClick={handleSync} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Synchronizing...
                </>
              ) : (
                'Sincronizar Dados'
              )}
            </Button>
          </div>

          {/* Recent Journal Entries Section */}
          <div className="card shadow-sm border-0 p-4 bg-white bg-opacity-75" style={{ backdropFilter: 'blur(10px)', borderRadius: '1rem' }}>
            <h5 className="fw-bold text-secondary mb-3">Recent Diary</h5>
            {recentJournals.length > 0 ? (
              recentJournals.map((journal: any) => (
                <div key={journal.id} className="mb-2 pb-2 border-bottom">
                  <small className="text-muted d-block">{journal.date.split('T')[0]}</small>
                  <span className="text-dark small">{journal.text}</span>
                </div>
              ))
            ) : (
              <p className="text-muted small mb-0">No journal entries yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Renders the modal organism and handles its state */}
      <DataEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleDataSubmit} 
      />
    </div>
  );
}