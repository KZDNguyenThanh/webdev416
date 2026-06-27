import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addBannersAction,
  deleteBannerAction,
  moveBannerAction,
  updateBannerAction,
} from "@/app/(admin)/admin/actions";
import { getHomeBanners } from "@/lib/banners";
import Image from "next/image";

export default async function AdminBannersPage() {
  const banners = await getHomeBanners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Banner trang chủ</h1>
        <p className="text-sm text-lightColor mt-1">
          Thêm nhiều ảnh quảng bá, ngoài trang chủ sẽ tự động chạy (carousel).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thêm banner</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addBannersAction} className="space-y-3 border p-4 rounded-md">
            <div>
              <p className="mb-1 text-sm font-medium">Tải ảnh từ máy (nhiều ảnh)</p>
              <Input
                type="file"
                name="images"
                accept="image/*"
                multiple
                className="h-auto py-2"
              />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Hoặc dán link ảnh</p>
              <Textarea
                name="imageUrls"
                placeholder="Mỗi dòng một link ảnh (hoặc cách nhau dấu phẩy)"
                rows={4}
              />
            </div>
            <Button type="submit">Thêm banner</Button>
            <p className="text-xs text-lightColor">
              Có thể dùng cả hai cách. Mỗi ảnh thành 1 banner, chỉnh link/thứ tự ở
              danh sách bên dưới.
            </p>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách banner ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {banners.length === 0 ? (
            <p className="text-sm text-lightColor">
              Chưa có banner. Trang chủ đang dùng ảnh mặc định.
            </p>
          ) : null}

          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-3 border p-3 rounded-md items-center"
            >
              <Image
                src={banner.imageUrl}
                alt={banner.alt || "banner"}
                width={120}
                height={68}
                className="w-[120px] h-[68px] rounded-md object-cover border"
              />

              <form
                action={updateBannerAction}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                <input type="hidden" name="id" value={banner.id} />
                <Input
                  name="link"
                  defaultValue={banner.link}
                  placeholder="Link khi bấm (mặc định /shop)"
                />
                <Input
                  name="alt"
                  defaultValue={banner.alt}
                  placeholder="Mô tả ảnh (alt)"
                />
                <Button type="submit" variant="outline" className="sm:col-span-2 w-fit">
                  Lưu
                </Button>
              </form>

              <div className="flex items-center gap-1.5">
                <form action={moveBannerAction}>
                  <input type="hidden" name="id" value={banner.id} />
                  <input type="hidden" name="dir" value="up" />
                  <button
                    type="submit"
                    disabled={index === 0}
                    className="px-2 py-1.5 rounded-md border text-sm disabled:opacity-40"
                  >
                    ▲
                  </button>
                </form>
                <form action={moveBannerAction}>
                  <input type="hidden" name="id" value={banner.id} />
                  <input type="hidden" name="dir" value="down" />
                  <button
                    type="submit"
                    disabled={index === banners.length - 1}
                    className="px-2 py-1.5 rounded-md border text-sm disabled:opacity-40"
                  >
                    ▼
                  </button>
                </form>
                <form action={deleteBannerAction}>
                  <input type="hidden" name="id" value={banner.id} />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                  >
                    Xóa
                  </button>
                </form>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
