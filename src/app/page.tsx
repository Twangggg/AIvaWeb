import { PreorderFormNoSSR } from "@/features/preorder/components/preorder-form-no-ssr";

const featureItems = [
  "Tro ly AI theo ngu canh",
  "Dieu khien bang giong noi",
  "Camera va nghe goi ranh tay"
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-center">
      <section className="flex-1 space-y-6">
        <span className="inline-flex rounded-full bg-brand-100 px-4 py-1 text-sm font-medium text-brand-800">
          AIva Smart Glasses
        </span>
        <h1 className="max-w-xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
          Kinh thong minh giup ban ket noi, ghi nho va hanh dong nhanh hon.
        </h1>
        <p className="max-w-xl text-lg text-slate-600">
          Trang pre-order chinh thuc cho dot mo ban dau tien. De lai thong tin de nhan uu dai som,
          thong bao phien ban demo va lich giao hang.
        </p>
        <ul className="space-y-2 text-slate-700">
          {featureItems.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section className="w-full max-w-lg flex-1">
        <PreorderFormNoSSR />
      </section>
    </main>
  );
}
