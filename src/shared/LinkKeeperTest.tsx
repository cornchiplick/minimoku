import FilterList from "@/features/navigation/ui/FilterList";
import FolderList from "@/features/navigation/ui/FolderList";
import ProfileSection from "@/features/profile/ui/ProfileSection";
import {FilterConstants, FolderConstants} from "@/shared/constants/navigation";
import Typography from "@/shared/home/atomic/Typography";
import SearchBar from "@/widgets/sidebar/SearchBar";
import ThemeToggleButton from "@/widgets/sidebar/ThemeToggleButton";
import {Archive, Bell, Edit, Eye, Folder, Plus, Star} from "lucide-react";
import {useState} from "react";

export default function JapaneseConversationApp() {
  const [searchQuery, setSearchQuery] = useState("");

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
      category: "기본 회화",
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
      category: "인사",
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
      category: "인사",
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
      category: "기본 회화",
    },
  ];

  const folders = [
    {id: FolderConstants.FOLDER_WORK, name: "업무", icon: Folder, count: 12},
    {id: FolderConstants.FOLDER_PERSONAL, name: "개인", icon: Folder, count: 8},
    {id: FolderConstants.FOLDER_ARCHIVE, name: "아카이브", icon: Archive, count: 24},
  ];

  const filters = [
    {id: FilterConstants.FILTER_ALL, name: "전체", icon: Star, count: 4},
    {id: FilterConstants.FILTER_UNREAD, name: "읽지 않음", icon: Bell, count: 2},
    {id: FilterConstants.FILTER_FAVORITE, name: "즐겨찾기", icon: Star, count: 1},
    {id: FilterConstants.FILTER_NOTIFIED, name: "알림 설정", icon: Bell, count: 0},
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="bg-background flex w-80 flex-col border-r border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-minimoku flex h-8 w-8 items-center justify-center rounded-lg">
                <Typography.P2 className="font-bold">日</Typography.P2>
              </div>
              <Typography.P1 className="font-semibold">JapaneseKeeper</Typography.P1>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggleButton />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {/* Add Link Button */}
            <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
              <Plus className="h-4 w-4" />
              <Typography.P1 className="text-white">링크 추가</Typography.P1>
            </button>
          </div>
        </div>

        {/* User Profile */}
        <ProfileSection />

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {/* Filter Categories */}
          <FilterList filters={filters} />

          {/* Folders */}
          <FolderList folders={folders} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Content Header */}
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">최근 링크</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl space-y-4">
            {phrases.map((phrase) => (
              <div
                key={phrase.id}
                className="rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300">
                <div className="flex items-start space-x-4">
                  {/* Thumbnail */}
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-600">
                    <span className="text-lg font-bold text-white">日</span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 flex items-center space-x-2 font-medium text-gray-900">
                          <Edit className="h-4 w-4 text-gray-400" />
                          <span>
                            {phrase.japanese} - {phrase.meaning}
                          </span>
                        </h3>
                        <p className="mb-2 text-sm text-gray-600">{phrase.url}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>개발자료</span>
                          <span>{phrase.createdAt}</span>
                          <div className="flex items-center space-x-2">
                            {phrase.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="ml-4 flex items-center space-x-2">
                        <button className="rounded p-1.5 transition-colors hover:bg-gray-100">
                          <Bell className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="rounded p-1.5 transition-colors hover:bg-gray-100">
                          <Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
                        </button>
                        <button className="rounded p-1.5 transition-colors hover:bg-gray-100">
                          <Eye className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Japanese Content Preview */}
                    <div className="mt-3 rounded-lg bg-gray-50 p-3">
                      <div className="mb-1 text-lg font-medium text-gray-900">
                        {phrase.japanese}
                      </div>
                      <div className="mb-1 text-sm text-gray-600">{phrase.romanji}</div>
                      <div className="text-sm text-gray-600">{phrase.korean}</div>
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
