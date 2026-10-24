const fs = require('fs');
const file = 'src/components/aurelia/ProductDetailModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { Product } from '@/data/types'",
  "import { Product } from '@/data/types'\nimport { allProducts } from '@/data/products'"
);

const recCode = `
  const recommendedProducts = React.useMemo(() => {
    if (!product) return []
    const recommendations = allProducts.filter(
      (p) =>
        p.id !== product.id &&
        (p.subCategory === product.subCategory || p.brand === product.brand || p.category === product.category)
    )
    return recommendations
      .sort((a, b) => {
        let scoreA = 0
        let scoreB = 0
        if (a.brand === product.brand) scoreA += 2
        if (a.subCategory === product.subCategory) scoreA += 2
        if (a.category === product.category) scoreA += 1
        if (b.brand === product.brand) scoreB += 2
        if (b.subCategory === product.subCategory) scoreB += 2
        if (b.category === product.category) scoreB += 1
        return scoreB - scoreA
      })
      .slice(0, 4)
  }, [product])
`;

content = content.replace('const [selectedQuantity, setSelectedQuantity] = useState(1)', 'const [selectedQuantity, setSelectedQuantity] = useState(1)' + recCode);

const recRender = `
                {/* Recommendations */}
                {recommendedProducts.length > 0 && (
                  <div className="mb-6">
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#c5a059] block mb-3">
                      Recommended For You
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {recommendedProducts.map((rec) => (
                        <div key={rec.id} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2 cursor-pointer" onClick={() => {}}>
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={rec.image || '/aurelia/atelier.jpg'} alt={rec.name} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="text-xs text-[#fbf8f3] font-serif line-clamp-1">{rec.name}</div>
                            <div className="text-[10px] text-[#e8e2d8]/60 font-sans">₹{rec.price.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
`;

content = content.replace('{/* Action Buttons */}', recRender + '              {/* Action Buttons */}');

fs.writeFileSync(file, content);
console.log('Done');
