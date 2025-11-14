import { useState, useEffect, useCallback } from 'react';
import SchoolStatsService, { SchoolStatistic, CreateStatisticData } from '../services/schoolStatsService';
import { SchoolStatsDisplay } from '../types/schoolStats';

export const useSchoolStats = () => {
  const [stats, setStats] = useState<SchoolStatsDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const schoolStatsService = SchoolStatsService.getInstance();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schoolStatsService.getVisibleStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      console.error('Error fetching school statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [schoolStatsService]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};

export const useSchoolStatsAdmin = () => {
  const [stats, setStats] = useState<SchoolStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const schoolStatsService = SchoolStatsService.getInstance();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await schoolStatsService.getAllStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      console.error('Error fetching admin school statistics:', err);
    } finally {
      setLoading(false);
    }
  }, [schoolStatsService]);

  const saveStatistic = useCallback(async (statData: CreateStatisticData) => {
    try {
      setSaving(true);
      setError(null);
      const savedStat = await schoolStatsService.saveStatistic(statData);
      
      // Update local state
      setStats(prevStats => {
        const existingIndex = prevStats.findIndex(stat => stat.key === statData.key);
        if (existingIndex >= 0) {
          // Update existing
          const updatedStats = [...prevStats];
          updatedStats[existingIndex] = savedStat;
          return updatedStats;
        } else {
          // Add new
          return [...prevStats, savedStat];
        }
      });
      
      return savedStat;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save statistic');
      console.error('Error saving school statistic:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [schoolStatsService]);

  const updateStatistic = useCallback(async (key: string, statData: Partial<CreateStatisticData>) => {
    try {
      setSaving(true);
      setError(null);
      const updatedStat = await schoolStatsService.updateStatistic(key, statData);
      
      // Update local state
      setStats(prevStats => {
        const updatedStats = [...prevStats];
        const index = updatedStats.findIndex(stat => stat.key === key);
        if (index >= 0) {
          updatedStats[index] = updatedStat;
        }
        return updatedStats;
      });
      
      return updatedStat;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update statistic');
      console.error('Error updating school statistic:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [schoolStatsService]);

  const deleteStatistic = useCallback(async (key: string) => {
    try {
      setSaving(true);
      setError(null);
      await schoolStatsService.deleteStatistic(key);
      
      // Remove from local state
      setStats(prevStats => prevStats.filter(stat => stat.key !== key));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete statistic');
      console.error('Error deleting school statistic:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [schoolStatsService]);

  const initializeDefaultStats = useCallback(async () => {
    try {
      setSaving(true);
      setError(null);
      await schoolStatsService.initializeDefaultStats();
      await fetchStats(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize default statistics');
      console.error('Error initializing default statistics:', err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [schoolStatsService, fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    saving,
    refetch: fetchStats,
    saveStatistic,
    updateStatistic,
    deleteStatistic,
    initializeDefaultStats
  };
};





















