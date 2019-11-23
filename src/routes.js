import Login from './pages/Login';
import Registration from './pages/Registration';
import ForgotPassword from './pages/Login/forgotPassword';
import MenuList from './pages/TifinMenu/MenuList';
import Request from './pages/Request';
import OrderExtraTifin from './pages/Order/Form';
import TifinList from './pages/Order'
import ChangeNominee from './pages/Profile/ChangeNominee';
import ChangeProfile from './pages/Profile/ChangeProfile';
import CancelTifin from './pages/CancelTIfin';
import BillingHistory from './pages/Billing';
import Plan from './pages/Plan';
import Ticket from './pages/Ticket';
import Support from './pages/Support';
import Auth from './pages/Auth';
import Payment from './pages/Payment';
import TicketForm from './pages/Ticket/TicketForm';
import TicketDetails from './pages/Ticket/TicketDetails';
import CancelTifinList from './pages/CancelTIfin/List';
import TodayOrderList from './pages/TodayOrder';
import TodayOrderDetails from './pages/TodayOrder/Details';
import ExtendTime from './pages/TodayOrder/ExtendTime';
import DishList from './pages/TifinMenu/DishList';
import AreaList from './pages/Registration/LocationList';
import PlanList from './pages/Registration/PlanList';

export default {
	Auth: { screen: Auth },
	Login: { screen: Login},
	Registration: { screen: Registration },
	ForgotPassword: { screen: ForgotPassword },
	MenuList: { screen: MenuList },
	OrderExtraTifin: { screen: TifinList },
	OrderForm: { screen: OrderExtraTifin},
	ChangeNominee: { screen: ChangeNominee },
	ChangeProfile: { screen: ChangeProfile },
	BillingCycle: { screen: BillingHistory },
	CancelTifin: { screen: CancelTifin },
	Plan: { screen: Plan },
	Ticket: { screen: Ticket },
	Settings: { screen: Request },
	Support: { screen: Support},
	TicketForm: { screen: TicketForm },
	Payment: {screen: Payment},
	TicketDetails: {screen: TicketDetails},
	CancelTifinList: {screen: CancelTifinList},
	TodayOrderList: {screen: TodayOrderList},
	TodayOrderDetails: {screen: TodayOrderDetails},
	ExtendTime: {screen: ExtendTime},
	DishList: {screen: DishList},
	AreaView: {screen: AreaList},
	PlanView: {screen: PlanList}
};
