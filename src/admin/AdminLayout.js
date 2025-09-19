
import { HiOutlineHome, HiOutlineCollection, HiOutlineMap, HiOutlineMenuAlt2 } from "react-icons/hi";

function AdminHeader() {
  return (
    <header className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-blue-700 text-2xl font-extrabold tracking-tight">NOMIO</span>
        <span className="text-xs text-gray-400 font-semibold ml-2">관리자 시스템</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-blue-600 transition"><HiOutlineMenuAlt2 size={22} /></button>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">A</div>
      </div>
    </header>
  );
}

function AdminSidebar({ menu, onMenuClick, active }) {
  const commonMenus = menu.filter(item => item.group === 'common');
  const placeMenus = menu.filter(item => item.group === 'place');
  const iconMap = {
    'legal-dong': <HiOutlineHome className="inline mr-2 text-lg" />,
    'classification': <HiOutlineCollection className="inline mr-2 text-lg" />,
    'tour-type': <HiOutlineMap className="inline mr-2 text-lg" />,
    'place-list': <HiOutlineMap className="inline mr-2 text-lg" />,
    'place-category': <HiOutlineCollection className="inline mr-2 text-lg" />,
  };
  return (
    <aside className="bg-gradient-to-b from-blue-900 to-blue-700 text-white w-60 min-h-screen pt-8 px-0 shadow-xl">
      <nav>
        <div className="mb-2 text-xs font-bold text-blue-200 px-6 tracking-widest">공통</div>
        <ul className="space-y-1 mb-6">
          {commonMenus.map((item) => (
            <li key={item.key}>
              <button
                className={`w-full flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                  active === item.key
                    ? "bg-white text-blue-800 shadow"
                    : "hover:bg-blue-800 hover:text-white text-blue-100"
                }`}
                onClick={() => onMenuClick(item.key)}
              >
                {iconMap[item.key]}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mb-2 text-xs font-bold text-blue-200 px-6 tracking-widest">여행지 관리</div>
        <ul className="space-y-1">
          {placeMenus.map((item) => (
            <li key={item.key}>
              <button
                className={`w-full flex items-center px-6 py-2 rounded-lg font-medium transition-all ${
                  active === item.key
                    ? "bg-white text-blue-800 shadow"
                    : "hover:bg-blue-800 hover:text-white text-blue-100"
                }`}
                onClick={() => onMenuClick(item.key)}
              >
                {iconMap[item.key]}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children, menu, onMenuClick, activeMenu }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar menu={menu} onMenuClick={onMenuClick} active={activeMenu} />
        <main className="flex-1 p-8 md:p-12 lg:p-16 bg-white/80 rounded-tl-3xl shadow-inner min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
