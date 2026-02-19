import { Link } from "react-router-dom";
import "../PaymentPage/style/paymentPage.style.css";
import { useAppSelector } from "../../features/hooks";

const OrderCompletePage = () => {
  const { orderNum } = useAppSelector((state) => state.order);

  if (orderNum === "") {
    return (
      <div className="confirmation-page max-w-4xl mx-auto px-4">
        <h1>주문 실패</h1>
        <div>
          메인페이지로 돌아가세요
          <Link to="/">메인페이지로 돌아가기</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page max-w-4xl mx-auto px-4">
      <img
        src="/image/greenCheck.png"
        width={100}
        className="check-image"
        alt="greenCheck.png"
      />
      <h2>예약이 완료됬습니다!</h2>
      <div>예약번호:하드코딩</div>
      <div>
        예약 확인은 내 예약 메뉴에서 확인해주세요
        <div className="text-align-center">
          <Link to="/account/purchase">내 예약 바로가기</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderCompletePage;
