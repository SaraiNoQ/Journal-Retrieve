'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import type { JournalResponse, SearchResult, LocalJournalInfo } from '@/types/journal';
import { API_CONFIG } from '@/config/constants';
import { searchJournal, loadJournalData } from '@/utils/excelReader';
import SettingsModal from '@/components/SettingsModal';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    secretKey: API_CONFIG.SECRET_KEY || '',
  });

  // 预加载Excel数据
  useEffect(() => {
    loadJournalData();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    setError(null);
    setSearchResult(null);
    
    try {
      // 首先搜索本地Excel数据
      const localResult = await searchJournal(searchTerm);
      
      if (localResult) {
        setSearchResult({
          source: 'local',
          data: localResult
        });
        return;
      }

      // 如果本地没有找到，则调用API
      const url = `${API_CONFIG.BASE_URL}?secretKey=${settings.secretKey}&publicationName=${searchTerm}`;
      const response = await axios.get<JournalResponse>(url, {
        paramsSerializer: {
          encode: (param: string) => param
        }
      });

      if (response.data.msg.toLowerCase() !== 'success') {
        setError(response.data.msg || '查询失败');
        return;
      }

      setSearchResult({
        source: 'api',
        data: response.data
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('搜索过程中发生错误，请稍后重试');
      }
      console.error('搜索出错:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = (newSettings: { secretKey: string }) => {
    setSettings(newSettings);
    // 可以选择将设置保存到 localStorage
    localStorage.setItem('journalSearchSettings', JSON.stringify(newSettings));
  };

  // 加载保存的设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('journalSearchSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const renderSearchResults = () => {
    if (!searchResult) return null;

    if (searchResult.source === 'local') {
      const localData = searchResult.data as LocalJournalInfo;
      return (
        <table className="min-w-full divide-y divide-gray-600">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">字段</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">值</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {Object.entries(localData).map(([key, value]) => (
              <tr key={key} className="hover:bg-white/5">
                <td className="px-4 py-3 text-sm">{key}</td>
                <td className="px-4 py-3 text-sm">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    const apiData = searchResult.data as JournalResponse;
    return (
      <table className="min-w-full divide-y divide-gray-600">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">指标</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">数值</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-600">
          {Object.entries(apiData.data.officialRank.all).map(([key, value], index) => (
            <tr key={index} className="hover:bg-white/5">
              <td className="px-4 py-3 text-sm">{key}</td>
              <td className="px-4 py-3 text-sm">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="container mx-auto px-4 py-16 relative">
        {/* 设置按钮 */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
          title="设置"
        >
          <Cog6ToothIcon className="h-6 w-6 text-white" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            期刊检索系统
          </h1>
          <p className="text-gray-300">输入期刊名称获取详细信息</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="请输入期刊名称..."
              className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:outline-none text-white placeholder-gray-400"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
            >
              <MagnifyingGlassIcon className="w-6 h-6 text-white" />
            </button>
          </motion.div>

          {loading && (
            <div className="text-center mt-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center text-white"
            >
              {error}
            </motion.div>
          )}

          {searchResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
            >
              <div className="overflow-x-auto">
                {renderSearchResults()}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={settings}
      />
    </main>
  );
}
