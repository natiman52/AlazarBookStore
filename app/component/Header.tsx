import { BookOpen, Search } from 'lucide-react';
import SearchAway from './clients/search';
export function Header() {
  const style:any = {
    topheader:{"flexWrap": "wrap","padding": ".5rem .5rem","gap":"1rem"},
    searchbar:{'minWidth':"10rem"}

  }
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div style={style.topheader} className="flex items-center justify-between ">
          <div className="flex items-center gap-3">
            <img src="/image.png" style={{'width':"40px","height":"40px","borderRadius":"50%"}} alt="" />
            <h1 className="text-2xl font-bold text-gray-900">የመጻሕፍት ዓለም</h1>
          </div>

          <div style={style.searchbar} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <SearchAway/>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
