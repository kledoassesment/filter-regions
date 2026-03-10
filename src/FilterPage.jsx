import {
  useLoaderData,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';

export async function loader() {
  const res = await fetch('/data/indonesia_regions.json');
  if (!res.ok) throw new Error('Failed to load region data');
  return res.json();
}

function ProvinceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function RegencyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M9 21V7l6-4v18M3 21V11l6-4"/>
    </svg>
  );
}
function DistrictIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="10" r="3"/>
      <path d="M12 2a8 8 0 0 1 8 8c0 5-8 13-8 13S4 15 4 10a8 8 0 0 1 8-8z"/>
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
    </svg>
  );
}
function ArrowDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
    </svg>
  );
}

function Combobox({ name, label, icon, options, value, onChange, disabled, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-xs font-semibold tracking-widest text-slate-500 uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </span>
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full appearance-none pl-9 pr-8 py-2.5 rounded-xl border text-sm font-medium
            transition-all duration-200 outline-none
            ${disabled
              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-white border-slate-200 text-slate-800 cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm'
            }
          `}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </div>
    </div>
  );
}

export default function FilterPage() {
  const { provinces, regencies, districts } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const provinceId = searchParams.get('province') || '';
  const regencyId  = searchParams.get('regency')  || '';
  const districtId = searchParams.get('district') || '';

  const filteredRegencies = regencies.filter(
    (r) => r.province_id === Number(provinceId)
  );
  const filteredDistricts = districts.filter(
    (d) => d.regency_id === Number(regencyId)
  );

  const selectedProvince = provinces.find((p) => p.id === Number(provinceId));
  const selectedRegency  = regencies.find((r) => r.id === Number(regencyId));
  const selectedDistrict = districts.find((d) => d.id === Number(districtId));

  const handleProvince = (val) => {
    setSearchParams(val ? { province: val } : {});
  };
  const handleRegency = (val) => {
    const next = { province: provinceId };
    if (val) next.regency = val;
    setSearchParams(next);
  };
  const handleDistrict = (val) => {
    const next = { province: provinceId, regency: regencyId };
    if (val) next.district = val;
    setSearchParams(next);
  };
  const handleReset = () => setSearchParams({});

  const crumbs = [
    { label: 'Indonesia', active: false },
    selectedProvince ? { label: selectedProvince.name, active: !selectedRegency } : null,
    selectedRegency  ? { label: selectedRegency.name,  active: !selectedDistrict } : null,
    selectedDistrict ? { label: selectedDistrict.name, active: true } : null,
  ].filter(Boolean);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">


      <aside className="w-72 min-h-screen bg-white border-r border-slate-100 flex flex-col shadow-sm">


        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <span className="font-bold text-slate-800 tracking-tight text-base">Frontend Assessment</span>
        </div>


        <div className="flex flex-col gap-6 px-6 pt-8 flex-1">
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Filter Wilayah</p>

          <Combobox
            name="province"
            label="Provinsi"
            icon={<ProvinceIcon />}
            options={provinces}
            value={provinceId}
            onChange={handleProvince}
            disabled={false}
            placeholder="Pilih Provinsi"
          />

          <Combobox
            name="regency"
            label="Kota/Kabupaten"
            icon={<RegencyIcon />}
            options={filteredRegencies}
            value={regencyId}
            onChange={handleRegency}
            disabled={!provinceId}
            placeholder={provinceId ? 'Pilih Kota/Kabupaten' : '— Pilih Provinsi dulu —'}
          />

          <Combobox
            name="district"
            label="Kecamatan"
            icon={<DistrictIcon />}
            options={filteredDistricts}
            value={districtId}
            onChange={handleDistrict}
            disabled={!regencyId}
            placeholder={regencyId ? 'Pilih Kecamatan' : '— Pilih Kota/Kabupaten dulu —'}
          />
        </div>


        <div className="px-6 pb-8 pt-6">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-blue-500 text-blue-600 text-sm font-semibold tracking-wide hover:bg-blue-50 active:bg-blue-100 transition-all duration-150"
          >
            <ResetIcon />
            RESET
          </button>
        </div>
      </aside>


      <div className="flex flex-col flex-1 overflow-hidden">


        <header className="bg-white border-b border-slate-100 px-8 py-4 shadow-sm">
          <nav className="breadcrumb flex items-center gap-2 text-sm">
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                )}
                <span className={crumb.active
                  ? 'font-bold text-blue-600'
                  : 'text-slate-400 font-medium'
                }>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        </header>


        <main className="flex-1 flex items-center justify-center bg-slate-50">
          {!selectedProvince ? (
            <div className="text-center text-slate-300 select-none">
              <svg className="mx-auto mb-4 opacity-40" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <p className="text-lg font-medium tracking-wide">Pilih wilayah untuk memulai</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full max-w-lg px-8 py-12">


              <div className="text-center">
                <p className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-2">Provinsi</p>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                  {selectedProvince.name}
                </h1>
              </div>

              {selectedRegency && (
                <>
                  <div className="text-slate-300 my-1"><ArrowDownIcon /></div>


                  <div className="text-center">
                    <p className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-2">Kota / Kabupaten</p>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                      {selectedRegency.name}
                    </h2>
                  </div>
                </>
              )}

              {selectedDistrict && (
                <>
                  <div className="text-slate-300 my-1"><ArrowDownIcon /></div>


                  <div className="text-center">
                    <p className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-2">Kecamatan</p>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
                      {selectedDistrict.name}
                    </h3>
                  </div>
                </>
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
