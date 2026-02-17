// import React, { useState, useEffect } from "react";
// import { Form, Modal, Button, Row, Col, Alert } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
// import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
// import "../style/adminProduct.style.css";
// import {
//   clearError,
//   createProduct,
//   editProduct,
// } from "../../../features/product/productSlice";

// const InitialFormData = {
//   name: "",
//   sku: "",
//   stock: {},
//   image: "",
//   description: "",
//   category: [],
//   status: "active",
//   price: 0,
// };

// const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
//   const { error, success, selectedProduct } = useSelector(
//     (state) => state.product
//   );
//   const [formData, setFormData] = useState(
//     mode === "new" ? { ...InitialFormData } : selectedProduct
//   );
//   const [stock, setStock] = useState([]);
//   const dispatch = useDispatch();
//   const [stockError, setStockError] = useState(false);

//   useEffect(() => {
//     if (success) setShowDialog(false);
//   }, [success]);

//   useEffect(() => {
//     if (error || !success) {
//       dispatch(clearError());
//     }
//     if (showDialog) {
//       if (mode === "edit") {
//         setFormData(selectedProduct);
//         // 객체형태로 온 stock을  다시 배열로 세팅해주기
//         const sizeArray = Object.keys(selectedProduct.stock).map((size) => [
//           size,
//           selectedProduct.stock[size],
//         ]);
//         setStock(sizeArray);
//       } else {
//         setFormData({ ...InitialFormData });
//         setStock([]);
//       }
//     }
//   }, [showDialog]);

//   const handleClose = () => {
//     //모든걸 초기화시키고;
//     // 다이얼로그 닫아주기
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     //재고를 입력했는지 확인, 아니면 에러
//     // 재고를 배열에서 객체로 바꿔주기
//     // [['M',2]] 에서 {M:2}로
//     if (mode === "new") {
//       //새 상품 만들기
//     } else {
//       // 상품 수정하기
//     }
//   };

//   const handleChange = (event) => {
//     //form에 데이터 넣어주기
//   };

//   const addStock = () => {
//     //재고타입 추가시 배열에 새 배열 추가
//   };

//   const deleteStock = (idx) => {
//     //재고 삭제하기
//   };

//   const handleSizeChange = (value, index) => {
//     //  재고 사이즈 변환하기
//   };

//   const handleStockChange = (value, index) => {
//     //재고 수량 변환하기
//   };

//   const onHandleCategory = (event) => {
//     if (formData.category.includes(event.target.value)) {
//       const newCategory = formData.category.filter(
//         (item) => item !== event.target.value
//       );
//       setFormData({
//         ...formData,
//         category: [...newCategory],
//       });
//     } else {
//       setFormData({
//         ...formData,
//         category: [...formData.category, event.target.value],
//       });
//     }
//   };

//   const uploadImage = (url) => {
//     //이미지 업로드
//   };

//   return (
//     <Modal show={showDialog} onHide={handleClose}>
//       <Modal.Header closeButton>
//         {mode === "new" ? (
//           <Modal.Title>Create New Product</Modal.Title>
//         ) : (
//           <Modal.Title>Edit Product</Modal.Title>
//         )}
//       </Modal.Header>
//       {error && (
//         <div className="error-message">
//           <Alert variant="danger">{error}</Alert>
//         </div>
//       )}
//       <Form className="form-container" onSubmit={handleSubmit}>
//         <Row className="mb-3">
//           <Form.Group as={Col} controlId="sku">
//             <Form.Label>Sku</Form.Label>
//             <Form.Control
//               onChange={handleChange}
//               type="string"
//               placeholder="Enter Sku"
//               required
//               value={formData.sku}
//             />
//           </Form.Group>

//           <Form.Group as={Col} controlId="name">
//             <Form.Label>Name</Form.Label>
//             <Form.Control
//               onChange={handleChange}
//               type="string"
//               placeholder="Name"
//               required
//               value={formData.name}
//             />
//           </Form.Group>
//         </Row>

//         <Form.Group className="mb-3" controlId="description">
//           <Form.Label>Description</Form.Label>
//           <Form.Control
//             type="string"
//             placeholder="Description"
//             as="textarea"
//             onChange={handleChange}
//             rows={3}
//             value={formData.description}
//             required
//           />
//         </Form.Group>

//         <Form.Group className="mb-3" controlId="stock">
//           <Form.Label className="mr-1">Stock</Form.Label>
//           {stockError && (
//             <span className="error-message">재고를 추가해주세요</span>
//           )}
//           <Button size="sm" onClick={addStock}>
//             Add +
//           </Button>
//           <div className="mt-2">
//             {stock.map((item, index) => (
//               <Row key={index}>
//                 <Col sm={4}>
//                   <Form.Select
//                     onChange={(event) =>
//                       handleSizeChange(event.target.value, index)
//                     }
//                     required
//                     defaultValue={item[0] ? item[0].toLowerCase() : ""}
//                   >
//                     <option value="" disabled selected hidden>
//                       Please Choose...
//                     </option>
//                     {SIZE.map((item, index) => (
//                       <option
//                         inValid={true}
//                         value={item.toLowerCase()}
//                         disabled={stock.some(
//                           (size) => size[0] === item.toLowerCase()
//                         )}
//                         key={index}
//                       >
//                         {item}
//                       </option>
//                     ))}
//                   </Form.Select>
//                 </Col>
//                 <Col sm={6}>
//                   <Form.Control
//                     onChange={(event) =>
//                       handleStockChange(event.target.value, index)
//                     }
//                     type="number"
//                     placeholder="number of stock"
//                     value={item[1]}
//                     required
//                   />
//                 </Col>
//                 <Col sm={2}>
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => deleteStock(index)}
//                   >
//                     -
//                   </Button>
//                 </Col>
//               </Row>
//             ))}
//           </div>
//         </Form.Group>

//         <Form.Group className="mb-3" controlId="Image" required>
//           <Form.Label>Image</Form.Label>
//           <CloudinaryUploadWidget uploadImage={uploadImage} />

//           <img
//             id="uploadedimage"
//             src={formData.image}
//             className="upload-image mt-2"
//             alt="uploadedimage"
//           ></img>
//         </Form.Group>

//         <Row className="mb-3">
//           <Form.Group as={Col} controlId="price">
//             <Form.Label>Price</Form.Label>
//             <Form.Control
//               value={formData.price}
//               required
//               onChange={handleChange}
//               type="number"
//               placeholder="0"
//             />
//           </Form.Group>

//           <Form.Group as={Col} controlId="category">
//             <Form.Label>Category</Form.Label>
//             <Form.Control
//               as="select"
//               multiple
//               onChange={onHandleCategory}
//               value={formData.category}
//               required
//             >
//               {CATEGORY.map((item, idx) => (
//                 <option key={idx} value={item.toLowerCase()}>
//                   {item}
//                 </option>
//               ))}
//             </Form.Control>
//           </Form.Group>

//           <Form.Group as={Col} controlId="status">
//             <Form.Label>Status</Form.Label>
//             <Form.Select
//               value={formData.status}
//               onChange={handleChange}
//               required
//             >
//               {STATUS.map((item, idx) => (
//                 <option key={idx} value={item.toLowerCase()}>
//                   {item}
//                 </option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         </Row>
//         {mode === "new" ? (
//           <Button variant="primary" type="submit">
//             Submit
//           </Button>
//         ) : (
//           <Button variant="primary" type="submit">
//             Edit
//           </Button>
//         )}
//       </Form>
//     </Modal>
//   );
// };

// export default NewItemDialog;
import { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col, Alert } from "react-bootstrap";
import CloudinaryUploadWidget from "../../../utils/CloudinaryUploadWidget";
import { CATEGORY, STATUS, SIZE } from "../../../constants/product.constants";
import "../style/adminProduct.style.css";
import {
  clearError,
  createProduct,
  editProduct,
} from "../../../features/product/productSlice";
import { useAppDispatch, useAppSelector } from "../../../features/hooks";
import type { Product } from "@/features/product/productSlice";

type FormControlElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

const InitialFormData: Partial<Product> & {
  stock: Record<string, number>;
  category: string[];
  status: string;
} = {
  name: "",
  sku: "",
  stock: {},
  image: "",
  description: "",
  category: [],
  status: "active",
  price: 0,
};

interface NewItemDialogProps {
  mode: "new" | "edit";
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
}

const NewItemDialog = ({
  mode,
  showDialog,
  setShowDialog,
}: NewItemDialogProps) => {
  const dispatch = useAppDispatch();
  const { error, success, selectedProduct } = useAppSelector(
    (state) => state.product,
  );
  const [formData, setFormData] = useState(InitialFormData);
  const [stock, setStock] = useState<[string, number][]>([]);
  const [stockError, _setStockError] = useState(false);

  useEffect(() => {
    if (success) setShowDialog(false);
  }, [success, setShowDialog]);

  useEffect(() => {
    if (error || !success) {
      dispatch(clearError());
    }
    if (showDialog) {
      // if (mode === "edit" && selectedProduct) {
      //   setFormData(selectedProduct);
      //   const sizeArray = Object.entries(
      //     selectedProduct.stock as Record<string, number>,
      //   ).map(([size, qty]) => [size, qty]);
      //   setStock(sizeArray);
      if (mode === "edit" && selectedProduct) {
        setFormData({
          ...selectedProduct,
          stock: (selectedProduct.stock || {}) as Record<string, number>,
          category: (selectedProduct.category ?? []) as string[],
          status: selectedProduct.status ?? "active",
        });
        // const sizeArray: [string, number][] = Object.entries(
        //   (selectedProduct.stock || {}) as Record<string, number>,
        // ).map(([size, qty]) => [size, qty]);
        // setStock(sizeArray);
        const sizeArray = Object.entries(
          (selectedProduct.stock || {}) as Record<string, number>,
        ).map(([size, qty]) => [size, qty] as [string, number]);
        setStock(sizeArray);
      } else {
        setFormData({ ...InitialFormData });
        setStock([]);
      }
    }
  }, [showDialog, mode, selectedProduct]);

  const handleClose = () => {
    setShowDialog(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void dispatch;
    void createProduct;
    void editProduct;
    if (mode === "new") {
      // 새 상품 만들기
    } else {
      // 상품 수정하기
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    const key = name as keyof typeof formData;
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [key]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const addStock = () => {
    setStock((prev) => [...prev, ["", 0]]);
  };

  const deleteStock = (idx: number) => {
    setStock((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSizeChange = (value: string, index: number) => {
    setStock((prev) => {
      const next = [...prev];
      next[index] = [value, next[index][1]];
      return next;
    });
  };

  const handleStockChange = (value: string, index: number) => {
    setStock((prev) => {
      const next = [...prev];
      next[index] = [next[index][0], Number(value) || 0];
      return next;
    });
  };

  const onHandleCategory = (event: React.ChangeEvent<FormControlElement>) => {
    const value = (event.target as HTMLSelectElement).value;
    if (formData.category?.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        category: prev.category?.filter((item) => item !== value) ?? [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: [...(prev.category ?? []), value],
      }));
    }
  };

  const uploadImage = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  return (
    <Modal show={showDialog} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "new" ? "Create New Product" : "Edit Product"}
        </Modal.Title>
      </Modal.Header>
      {error && (
        <div className="error-message">
          <Alert variant="danger">{error}</Alert>
        </div>
      )}
      <Form className="form-container" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="sku">
            <Form.Label>Sku</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="text"
              placeholder="Enter Sku"
              required
              value={formData.sku ?? ""}
              name="sku"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              type="text"
              placeholder="Name"
              required
              value={formData.name ?? ""}
              name="name"
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Description"
            as="textarea"
            onChange={handleChange}
            rows={3}
            value={formData.description ?? ""}
            required
            name="description"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="stock">
          <Form.Label className="mr-1">Stock</Form.Label>
          {stockError && (
            <span className="error-message">재고를 추가해주세요</span>
          )}
          <Button type="button" size="sm" onClick={addStock}>
            Add +
          </Button>
          <div className="mt-2">
            {stock.map((item, index) => (
              <Row key={index}>
                <Col sm={4}>
                  <Form.Select
                    onChange={(e) => handleSizeChange(e.target.value, index)}
                    required
                    value={item[0] ?? ""}
                  >
                    <option value="" disabled>
                      Please Choose...
                    </option>
                    {SIZE.map((s, i) => (
                      <option
                        value={s.toLowerCase()}
                        disabled={stock.some(
                          ([size]) => size === s.toLowerCase(),
                        )}
                        key={i}
                      >
                        {s}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col sm={6}>
                  <Form.Control
                    onChange={(e) => handleStockChange(e.target.value, index)}
                    type="number"
                    placeholder="number of stock"
                    value={item[1]}
                    required
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => deleteStock(index)}
                  >
                    -
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="Image">
          <Form.Label>Image</Form.Label>
          <CloudinaryUploadWidget uploadImage={uploadImage} />
          <img
            id="uploadedimage"
            src={formData.image}
            className="upload-image mt-2"
            alt="uploadedimage"
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={formData.price ?? 0}
              required
              onChange={handleChange}
              type="number"
              placeholder="0"
              name="price"
            />
          </Form.Group>
          <Form.Group as={Col} controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              multiple
              onChange={onHandleCategory}
              value={formData.category ?? []}
              required
            >
              {CATEGORY.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={formData.status ?? "active"}
              // onChange={(e) =>
              //   setFormData((prev) => ({ ...prev, status: e.target.value }))
              // }
              onChange={(e: React.ChangeEvent<unknown>) =>
                setFormData((prev) => ({
                  ...prev,
                  status: (e.target as HTMLSelectElement).value,
                }))
              }
              required
            >
              {STATUS.map((item, idx) => (
                <option key={idx} value={item.toLowerCase()}>
                  {item}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit">
          {mode === "new" ? "Submit" : "Edit"}
        </Button>
      </Form>
    </Modal>
  );
};
export default NewItemDialog;
