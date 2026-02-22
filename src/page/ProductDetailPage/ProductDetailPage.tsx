import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ColorRing } from "react-loader-spinner";
import { currencyFormat } from "../../utils/number";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Flame, Heart } from "lucide-react";

const ProductDetail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { selectedProduct, loading } = useAppSelector((state) => state.product);
  const user = useAppSelector((state) => state.user.user);
  const [size, setSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (id) {
      dispatch(getProductDetail(id));
    }
  }, [id, dispatch]);

  const addItemToCart = () => {
    if (!selectedProduct) return;
    if (size === "") {
      setSizeError(true);
      return;
    }
    if (!user) {
      navigate("/login");
      return;
    }

    console.log("Add to cart:", selectedProduct._id, size);
  };
  const selectSize = (value: string) => {
    setSize(value);
    setSizeError(false);
  };

  if (loading || !selectedProduct) {
    return (
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  }

  const stock = selectedProduct.stock as Record<string, number>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 lg:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
        <div className="relative group">
          {" "}
          <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
            <CarouselContent>
              {selectedProduct.image.map((img, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square overflow-hidden rounded-md bg-zinc-100">
                    <img
                      src={img}
                      className="h-full w-full object-cover"
                      alt={`${selectedProduct.name}-${index}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {count > 1 && (
              <div className="absolute bottom-4 left-1/2 opacity-0 group-hover:opacity-75 transition-opacity -translate-x-1/2 bg-black/25 text-white text-[11px] font-medium px-2 py-1 rounded-md backdrop-blur-sm">
                {current} / {count}
              </div>
            )}
            <CarouselPrevious className="left-0.5 opacity-0 group-hover:opacity-75 transition-opacity" />
            <CarouselNext className="right-0.5 opacity-0 group-hover:opacity-75 transition-opacity" />
          </Carousel>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm transition-all"
            onClick={() => console.log("Wishlist toggle")}
          >
            <Heart className="size-5 text-zinc-400 hover:text-red-500 transition-colors" />
          </Button>
        </div>
        <div className="flex flex-col gap-1">
          <div className=" pb-6">
            <div className="flex gap-2 mb-2">
              {selectedProduct.category.map((cat) => (
                <Badge
                  key={cat}
                  className="rounded-sm uppercase text-[10px] bg-zinc-100 text-zinc-600 font-bold tracking-tight px-2 py-0.5"
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <h1 className="text-1xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              {selectedProduct.name}
            </h1>
            <p className="mt-2 text-2xl font-bold text-zinc-900">
              ${currencyFormat(selectedProduct.price)}
            </p>
          </div>

          <div>
            <p className="mt-1 pb-2 text-sm text-zinc-600 leading-relaxed">
              {selectedProduct.description}
            </p>

            <p className="text-[11px] text-zinc-400 italic border-t pt-2 mb-8 leading-normal">
              * For the most accurate information, please refer to the actual
              product packaging. Nutrition and ingredients may vary by store
              location.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-zinc-900">SELECT SIZE</p>
              <Select onValueChange={(value) => selectSize(value)} value={size}>
                <SelectTrigger
                  className={`w-full h-12 ${sizeError ? "border-red-500 ring-1 ring-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select serving size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(stock)
                    .sort((a, b) => {
                      const SIZE_ORDER = ["single", "double", "family"];
                      return (
                        SIZE_ORDER.indexOf(a.toLowerCase()) -
                        SIZE_ORDER.indexOf(b.toLowerCase())
                      );
                    })
                    .map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        disabled={stock[item] <= 0}
                        className="cursor-pointer"
                      >
                        <span className="flex justify-between w-full gap-10">
                          <span>{item.toUpperCase()}</span>
                          {stock[item] <= 0 && (
                            <span className="text-red-500 text-xs font-medium">
                              SOLD OUT
                            </span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {size && stock[size] > 0 && stock[size] <= 10 && (
                <p className="text-[13px] text-red-600 mt-3 font-bold flex items-center gap-1 animate-pulse">
                  <Flame className="size-4 fill-red-600" /> ONLY {stock[size]}{" "}
                  LEFT! ORDER SOON
                </p>
              )}
              {sizeError && (
                <p className="text-xs text-red-500 font-medium">
                  Please select a size to continue
                </p>
              )}
            </div>
          </div>

          <Button
            size="lg"
            className="w-full mt-6 h-14 text-lg cursor-pointer font-bold bg-zinc-900 text-white transition-all duration-500 ease-in-out hover:bg-primary"
            onClick={addItemToCart}
          >
            ADD TO CART
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
