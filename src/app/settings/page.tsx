
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/app-header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Trash2, Languages, LifeBuoy, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import type { Language } from "@/context/language-context";


export default function SettingsPage() {
  const { user, deleteAccount, loading } = useAuth();
  const router = useRouter();
  const { t, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast({
        title: t('settings.deleteAccount.toastSuccessTitle'),
        description: t('settings.deleteAccount.toastSuccessDescription'),
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('settings.deleteAccount.toastErrorTitle'),
        description: error.message || t('settings.deleteAccount.toastErrorDescription'),
      });
      setIsDeleting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-headline">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="container mx-auto max-w-2xl space-y-8">
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-center">
            {t('settings.title')}
          </h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" />
                <span>{t('settings.language.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.language.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Select defaultValue="english" onValueChange={(value: Language) => setLanguage(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">{t('settings.language.english')}</SelectItem>
                  <SelectItem value="hindi">{t('settings.language.hindi')}</SelectItem>
                  <SelectItem value="bengali">{t('settings.language.bengali')}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-primary" />
                <span>{t('settings.support.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.support.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 font-sans">
              <a href="https://wa.me/9123849124" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">+91 91238 49124</p>
                </div>
              </a>
               <a href="https://wa.me/8274077646" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">+91 82740 77646</p>
                </div>
              </a>
              <a href="mailto:credipilot@gmail.com" className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary transition-colors">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-semibold">{t('settings.support.email')}</p>
                  <p className="text-sm text-muted-foreground">credipilot@gmail.com</p>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                <span>{t('settings.deleteAccount.title')}</span>
              </CardTitle>
              <CardDescription>{t('settings.deleteAccount.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">{t('settings.deleteAccount.button')}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('settings.deleteAccount.dialogTitle')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('settings.deleteAccount.dialogDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>{t('settings.deleteAccount.dialogCancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting}>
                      {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('settings.deleteAccount.dialogContinue')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
