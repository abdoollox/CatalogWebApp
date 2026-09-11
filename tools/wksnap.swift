// HTML sahifani Safari dvigatelida (WebKit) chizib, PNG qilib saqlaydi.
// iPhone/Mac dagi Telegram ham shu dvigateldan foydalanadi - shuning uchun
// u yerdagi ko'rinishni tekshirish va karta rasmlarini yasash uchun qulay.
//
//   swiftc -O tools/wksnap.swift -o /tmp/wksnap      (faqat macOS)
//   /tmp/wksnap <url> <chiqish.png> <eni> <bo'yi> [js]
import Cocoa
import WebKit

let a = CommandLine.arguments
guard a.count >= 5, let url = URL(string: a[1]), let w = Double(a[3]), let h = Double(a[4]) else {
    print("ishlatish: wksnap <url> <out.png> <eni> <bo'yi> [js]"); exit(64)
}
let out = a[2]
let js = a.count > 5 ? a[5] : "1"

class Loader: NSObject, WKNavigationDelegate {
    func webView(_ web: WKWebView, didFinish n: WKNavigation!) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            web.evaluateJavaScript(js) { r, e in
                if let e = e { print("JS xato:", e) }
                if let r = r { print("JS:", r) }
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    web.takeSnapshot(with: WKSnapshotConfiguration()) { img, err in
                        guard let img = img, let tiff = img.tiffRepresentation,
                              let rep = NSBitmapImageRep(data: tiff),
                              let png = rep.representation(using: .png, properties: [:]) else {
                            print("Rasm olinmadi:", err as Any); exit(1)
                        }
                        try! png.write(to: URL(fileURLWithPath: out))
                        exit(0)
                    }
                }
            }
        }
    }
}

let app = NSApplication.shared
let win = NSWindow(contentRect: NSRect(x: 0, y: 0, width: w, height: h),
                   styleMask: [.borderless], backing: .buffered, defer: false)
let web = WKWebView(frame: win.contentView!.bounds)
win.contentView!.addSubview(web)
let loader = Loader()
web.navigationDelegate = loader
win.setFrameOrigin(NSPoint(x: -5000, y: 0))
win.orderFrontRegardless()
web.load(URLRequest(url: url))
DispatchQueue.main.asyncAfter(deadline: .now() + 30) { print("Vaqt tugadi"); exit(2) }
app.run()
