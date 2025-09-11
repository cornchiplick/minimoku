import { Archive, Bell, Edit, Eye, Folder, Moon, Plus, Search, Settings, Star, User } from 'lucide-react';
import { useState } from 'react';

export default function JapaneseConversationApp() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const phrases = [
    {
      id: 1,
      japanese: "はい！いいですよ",
      romanji: "hai! ii desu yo",
      korean: "하이! 이이 데스 요",
      meaning: "네! 좋아요",
      url: "https://japanese-notes.app/phrase/1",
      tags: ["React", "Frontend"],
      createdAt: "24시간 전",
      category: "기본 회화"
    },
    {
      id: 2,
      japanese: "おはようございます",
      romanji: "ohayou gozaimasu",
      korean: "오하요 고자이마스",
      meaning: "안녕하세요 (아침인사)",
      url: "https://japanese-notes.app/phrase/2",
      tags: ["Vue", "Frontend"],
      createdAt: "2일 전",
      category: "인사"
    },
    {
      id: 3,
      japanese: "ありがとうございます",
      romanji: "arigatou gozaimasu",
      korean: "아리가토 고자이마스",
      meaning: "감사합니다",
      url: "https://japanese-notes.app/phrase/3",
      tags: ["JavaScript"],
      createdAt: "3일 전",
      category: "인사"
    },
    {
      id: 4,
      japanese: "すみません",
      romanji: "sumimasen",
      korean: "스미마센",
      meaning: "실례합니다/죄송합니다",
      url: "https://japanese-notes.app/phrase/4",
      tags: ["TypeScript"],
      createdAt: "1주일 전",
      category: "기본 회화"
    }
  ];

  const categories = [
    { name: '전체', icon: Star, count: 4 },
    { name: '읽지 않음', icon: Bell, count: 2 },
    { name: '즐겨찾기', icon: Star, count: 1 },
    { name: '알림 설정', icon: Bell, count: 0 }
  ];

  const folders = [
    { name: '업무', icon: Folder, count: 12 },
    { name: '개인', icon: Folder, count: 8 },
    { name: '아카이브', icon: Archive, count: 24 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">日</span>
              </div>
              <span className="font-semibold text-gray-900">JapaneseKeeper</span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Moon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="링크 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          
          {/* Add Link Button */}
          <button className="w-full mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>링크 추가</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">yeooom</div>
              <div className="text-sm text-gray-500">개정관리</div>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Filter Categories */}
          <div className="p-4">
            <div className="text-sm font-medium text-gray-500 mb-3">빠른 필터</div>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <category.icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </div>
                  {category.count > 0 && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Folders */}
          <div className="p-4 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-500 mb-3">폴더</div>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder.name}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <folder.icon className="w-4 h-4" />
                    <span className="text-sm">{folder.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{folder.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">최근 링크</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4 max-w-4xl">
            {phrases.map((phrase) => (
              <div
                key={phrase.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-600 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">日</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1 flex items-center space-x-2">
                          <Edit className="w-4 h-4 text-gray-400" />
                          <span>{phrase.japanese} - {phrase.meaning}</span>
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{phrase.url}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>개발자료</span>
                          <span>{phrase.createdAt}</span>
                          <div className="flex items-center space-x-2">
                            {phrase.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                          <Bell className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                          <Star className="w-4 h-4 text-gray-400 hover:text-yellow-500" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Japanese Content Preview */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-medium text-gray-900 mb-1">
                        {phrase.japanese}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {phrase.romanji}
                      </div>
                      <div className="text-sm text-gray-600">
                        {phrase.korean}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}