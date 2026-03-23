# Δωρεάν hosting + δικό σου domain

Όλα παρακάτω έχουν **δωρεάν βασικό πλάνο** και επιτρέπουν **custom domain** (το domain που έχεις ήδη αγοράσει).

| Υπηρεσία | Σημειώσεις |
|----------|------------|
| **[Cloudflare Pages](https://pages.cloudflare.com/)** | Πολύ γρήγορο CDN, δωρεάν SSL, συνδέεις domain μέσω Cloudflare DNS. Ιδανικό για στατικό site (HTML/CSS/JS). |
| **[Netlify](https://www.netlify.com/)** | Drag & drop φάκελο ή σύνδεση με GitHub. Δωρεάν SSL, custom domain σε λίγα βήματα. |
| **[GitHub Pages](https://pages.github.com/)** | Δωρεάν αν έχεις/φτιάξεις λογαριασμό GitHub. Custom domain + HTTPS. |
| **[Vercel](https://vercel.com/)** | Παρόμοιο με Netlify, καλό για στατικά sites. |

### Γενικά βήματα (όλες οι πλατφόρμες)

1. Ανέβασε τα αρχεία του project (`index.html`, `styles.css`, `script.js`, φάκελος `images/`).
2. Στο panel της υπηρεσίας, πρόσθεσε το domain σου.
3. Στον registrar του domain (π.χ. Papaki, Namecheap), βάλε τα **DNS records** που σου δίνει η πλατφόρμα (συνήθως A/CNAME ή nameservers για Cloudflare).

Μετά το deploy, άλλαξε στο `index.html` τα `https://example.com/` σε την πραγματική σου διεύθυνση (`canonical`, `og:url`).
