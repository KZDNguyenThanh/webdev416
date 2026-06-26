import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import {
  removeSettingAction,
  upsertSettingAction,
} from "@/app/(admin)/admin/actions";

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany({
    orderBy: { key: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-lightColor mt-1">
          Store key-value configuration as JSON.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create / Update Setting</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={upsertSettingAction}
            className="space-y-3 border p-4 rounded-md"
          >
            <Input name="key" placeholder="setting.key" required />
            <Textarea
              name="value"
              placeholder='{"foo":"bar"} or plain text'
              rows={6}
              required
            />
            <Button type="submit">Save Setting</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stored Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.map((setting) => (
            <div key={setting.key} className="border p-3 rounded-md">
              <p className="font-semibold text-sm">{setting.key}</p>
              <pre className="text-xs text-lightColor mt-2 whitespace-pre-wrap">
                {JSON.stringify(setting.value, null, 2)}
              </pre>
              <form action={removeSettingAction} className="mt-3">
                <input type="hidden" name="key" value={setting.key} />
                <Button type="submit" variant="destructive">
                  Delete
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
