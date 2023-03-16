/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export const Footer = () => {
    return (
        <div className="section-footer bg-white border-t-4 border-[#ee4d2d] pt-10">
            <div className="capitalize pb-2 max-w-7xl mx-auto md:px-10 px-1.5">
                <div className="flex flex-col gap-4 text-gray-600">
                    <span className="text-sm font-semibold">SHOPEE - GÌ CŨNG CÓ, MUA HẾT Ở SHOPEE</span>
                    <span className="text-[11px] tracking-wide">
                        Shopee - ứng dụng mua sắm trực tuyến thú vị, tin cậy, an toàn và miễn phí! Shopee là nền tảng
                        giao dịch trực tuyến hàng đầu ở Đông Nam Á, có trụ sở chính ở Singapore, đã có mặt ở khắp các
                        khu vực Singapore, Malaysia, Indonesia, Thái Lan, Philippines, Đài Loan, Brazil, México &
                        Colombia. Với sự đảm bảo của Shopee, bạn sẽ mua hàng trực tuyến an tâm và nhanh chóng hơn bao
                        giờ hết!
                    </span>
                    <span className="text-sm font-semibold">
                        MUA SẮM VÀ BÁN HÀNG ONLINE ĐƠN GIẢN, NHANH CHÓNG VÀ AN TOÀN
                    </span>
                    <span className="text-[11px] tracking-wide">
                        Nếu bạn đang tìm kiếm một trang web để mua và bán hàng trực tuyến thì Shopee.vn là một sự lựa
                        chọn tuyệt vời dành cho bạn. Shopee là trang thương mại điện tử cho phép người mua và người bán
                        tương tác và trao đổi dễ dàng thông tin về sản phẩm và chương trình khuyến mãi của shop. Do đó,
                        việc mua bán trên Shopee trở nên nhanh chóng và đơn giản hơn. Bạn có thể trò chuyện trực tiếp
                        với nhà bán hàng để hỏi trực tiếp về mặt hàng cần mua. Còn nếu bạn muốn tìm mua những dòng sản
                        phẩm chính hãng, uy tín, Shopee Mall chính là sự lựa chọn lí tưởng dành cho bạn. Để bạn có thể
                        dễ dàng khi tìm hiểu và sử dụng sản phẩm, Shopee Blog - trang blog thông tin chính thức của
                        Shopee - sẽ giúp bạn có thể tìm được cho mình các kiến thức về xu hướng thời trang, review công
                        nghệ, mẹo làm đẹp, tin tức tiêu dùng và deal giá tốt bất ngờ.
                    </span>

                    <span className="text-[11px] tracking-wide">
                        Đến với Shopee, cơ hội để trở thành một nhà bán hàng dễ dàng hơn bao giờ hết. Chỉ với vài thao
                        tác trên ứng dụng, bạn đã có thể đăng bán ngay những sản phẩm của mình. Không những thế, các nhà
                        bán hàng có thể tự tạo chương trình khuyến mãi trên Shopee để thu hút người mua với những sản
                        phẩm có mức giá hấp dẫn. Khi đăng nhập tại Shopee Kênh người bán, bạn có thể dễ dàng phân loại
                        sản phẩm, theo dõi đơn hàng, chăm sóc khách hàng và cập nhập ngay các hoạt động của shop.
                    </span>
                </div>
            </div>
            <div className="bg-[#FBFBFB] text-gray-600 mt-10 pb-10">
                <div className="md:px-10 px-1.5 pb-2 mx-auto capitalize max-w-7xl">
                    <div className="grid grid-cols-2 gap-4 pt-10 lg:grid-cols-5 md:grid-cols-3">
                        <div className="flex flex-col text-[12px] gap-2.5">
                            <h3 className="text-sm font-bold text-gray-900">CHĂM SÓC KHÁCH HÀNG</h3>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Trung Tâm Trợ Giúp</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Shopee Blog</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Shopee Mall</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Hướng Dẫn Mua Hàng</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Hướng Dẫn Bán Hàng</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Thanh Toán</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Shopee Xu</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Vận Chuyển</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Trả Hàng & Hoàn Tiền</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Chăm Sóc Khách Hàng</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Chính Sách Bảo Hành</span>
                        </div>
                        <div className="flex flex-col text-[12px] gap-2.5">
                            <h3 className="text-sm font-bold text-gray-900">VỀ SHOPEE</h3>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Giới Thiệu Về Shopee Việt Nam</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Tuyển Dụng</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Điều Khoản Shopee</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Chính Sách Bảo Mật</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Chính Hãng</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Flash Sales</span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Kênh Người Bán </span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">
                                Chương Trình Tiếp Thị Liên Kết Shopee
                            </span>
                            <span className="cursor-pointer hover:text-[#ee4d2d]">Liên Hệ Với Truyền Thông</span>
                        </div>
                        <div className="flex flex-col text-[12px] gap-2.5">
                            <h3 className="text-sm font-bold text-gray-900">THANH TOÁN</h3>
                            <div className="grid grid-cols-3 gap-1.5">
                                <div className="bg-white shadow-sm flex items-center py-2.5 justify-center">
                                    <img src="https://cf.shopee.vn/file/d4bbea4570b93bfd5fc652ca82a262a8" alt="" />
                                </div>
                                <div className="bg-white shadow-sm flex items-center py-2.5 justify-center">
                                    <img src="https://cf.shopee.vn/file/a0a9062ebe19b45c1ae0506f16af5c16" alt="" />
                                </div>
                                <div className="bg-white shadow-sm flex items-center py-2.5 justify-center">
                                    <img src="https://cf.shopee.vn/file/38fd98e55806c3b2e4535c4e4a6c4c08" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col text-[12px] gap-2.5">
                            <h3 className="text-sm font-bold text-gray-900">THEO DÕI CHÚNG TÔI TRÊN</h3>
                            <div className="flex flex-col gap-2.5">
                                <div className="flex gap-2.5 items-center">
                                    <FaFacebook className="w-5 h-5" />
                                    <span className="cursor-pointer hover:text-[#ee4d2d]">Facebook</span>
                                </div>
                                <div className="flex gap-2.5 items-center">
                                    <FaInstagram className="w-5 h-5" />
                                    <span className="cursor-pointer hover:text-[#ee4d2d]">Instagram</span>
                                </div>
                                <div className="flex gap-2.5 items-center">
                                    <FaLinkedinIn className="w-5 h-5" />
                                    <span className="cursor-pointer hover:text-[#ee4d2d]">LinkedIn</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col text-[12px] gap-2.5">
                            <h3 className="text-sm font-bold text-gray-900">TẢI ỨNG DỤNG SHOPEE NGAY THÔI</h3>
                            <div className="flex gap-1">
                                <div>
                                    <img src="https://cf.shopee.vn/file/a5e589e8e118e937dc660f224b9a1472" alt="" />
                                </div>
                                <div className="flex flex-col gap-1.5 justify-center items-center">
                                    <img src="https://cf.shopee.vn/file/ad01628e90ddf248076685f73497c163" alt="" />
                                    <img src="https://cf.shopee.vn/file/ae7dced05f7243d0f3171f786e123def" alt="" />
                                    <img src="https://cf.shopee.vn/file/35352374f39bdd03b25e7b83542b2cb0" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
