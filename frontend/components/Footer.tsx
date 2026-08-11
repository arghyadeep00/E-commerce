import Link from "next/link";
import { ShieldCheck, Truck, HeadphonesIcon, Smartphone, Smile } from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="bg-muted/30 pt-16 pb-8 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Top Section: Newsletter & Trust Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12 border-b border-border/50">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-xl">
                N
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-foreground">
                NexaMart
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your premium destination for the latest smartphones, laptops, and tech accessories. Empowering your digital lifestyle.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Smile className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Smile className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Smile className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <Smile className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Free Shipping</h4>
              <p className="text-xs text-muted-foreground text-center sm:text-left">On orders over $500</p>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm mb-1">1 Year Warranty</h4>
              <p className="text-xs text-muted-foreground text-center sm:text-left">Guaranteed authentic</p>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
                <HeadphonesIcon className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm mb-1">24/7 Support</h4>
              <p className="text-xs text-muted-foreground text-center sm:text-left">Dedicated assistance</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-border/50">
          <div>
            <h4 className="font-bold mb-6">Shop Categories</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/category/mobiles" className="hover:text-primary transition-colors">Smartphones</Link></li>
              <li><Link href="/category/laptops" className="hover:text-primary transition-colors">Laptops & PCs</Link></li>
              <li><Link href="/category/tablets" className="hover:text-primary transition-colors">Tablets & Readers</Link></li>
              <li><Link href="/category/wearables" className="hover:text-primary transition-colors">Smartwatches</Link></li>
              <li><Link href="/category/accessories" className="hover:text-primary transition-colors">Audio & Accessories</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Customer Service</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">Help Center & FAQ</Link></li>
              <li><Link href="/order-tracking" className="hover:text-primary transition-colors">Track Your Order</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/warranty" className="hover:text-primary transition-colors">Warranty Info</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">About NexaMart</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-primary transition-colors">Press & Media</Link></li>
              <li><Link href="/sustainability" className="hover:text-primary transition-colors">Sustainability</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Tech Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Download Our App</h4>
            <p className="text-sm text-muted-foreground mb-4">Get exclusive app-only deals and faster checkout.</p>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl">
                <Smartphone className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-muted-foreground">Download on the</div>
                  <div className="font-bold leading-tight">App Store</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 rounded-xl">
                <Smartphone className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-muted-foreground">GET IT ON</div>
                  <div className="font-bold leading-tight">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Payments */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NexaMart Electronics. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="mr-2 hidden sm:inline">Secure Payments:</span>
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-background rounded border flex items-center justify-center">
                <Smile className="w-4 h-4" />
              </div>
              <div className="w-10 h-6 bg-background rounded border flex items-center justify-center font-bold text-[10px]">
                VISA
              </div>
              <div className="w-10 h-6 bg-background rounded border flex items-center justify-center font-bold text-[10px]">
                MC
              </div>
              <div className="w-10 h-6 bg-background rounded border flex items-center justify-center font-bold text-[10px]">
                AMEX
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
