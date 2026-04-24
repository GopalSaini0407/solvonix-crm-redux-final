import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  Download,
  Edit,
  Eye,
  Menu,
  MoreVertical,
  Target,
  Trash2,
  UserPlus,
} from "lucide-react";
import { HiOutlineViewGrid } from "react-icons/hi";
import { useModal } from "../../context/ModalContext";
import CustomButton from "../../components/ui/CustomButton";
import Loader from "../../components/ui/Loader";
import { TabsContent, TabsList, TabsTrigger } from "../../components/shared/tabs";
import { TabsWithUrl } from "../../utils/TabsWithUrl";
import OpportunityDropdow from "../opportunityStage/OpportunityDropdow";
import OpportunityForm from "./OpportunityForm";
import ViewOpportunityDetails from "./ViewOpportunityDetails";
import {
  deleteOpportunity,
  getOpportunities,
} from "./opportunitySlice";

const statusStyles = {
  open: "bg-blue-100 text-blue-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
  hold: "bg-yellow-100 text-yellow-700",
};

const OpportunityList = () => {
  const dispatch = useDispatch();
  const { openModal, closeModal } = useModal();
  const { opportunities, pagination, loading, error } = useSelector(
    (state) => state.opportunities
  );

  const [filters, setFilters] = useState({
    search: "",
    stage_id: "",
    status: "",
    is_active: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(
        getOpportunities({
          page: currentPage,
          ...filters,
        })
      );
    }, 300);

    return () => clearTimeout(delay);
  }, [dispatch, currentPage, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.search, filters.stage_id, filters.status, filters.is_active]);

  const filteredOpportunities = useMemo(() => {
    return (opportunities || []).filter((opportunity) => {
      const searchLower = filters.search.trim().toLowerCase();
      const name = (opportunity.name || "").toLowerCase();
      const description = (opportunity.description || "").toLowerCase();
      const contactName = (opportunity.contact?.name || "").toLowerCase();
      const status = String(opportunity.status || "");
      const stageId = String(opportunity.stage_id || opportunity.stage?.id || "");
      const isActive = String(opportunity.is_active ?? "");

      const matchesSearch =
        !searchLower ||
        name.includes(searchLower) ||
        description.includes(searchLower) ||
        contactName.includes(searchLower);

      const matchesStage = !filters.stage_id || stageId === String(filters.stage_id);
      const matchesStatus = !filters.status || status === filters.status;
      const matchesActive =
        !filters.is_active || isActive === String(filters.is_active);

      return matchesSearch && matchesStage && matchesStatus && matchesActive;
    });
  }, [opportunities, filters]);

  const totalValue = filteredOpportunities.reduce((sum, item) => {
    const value = Number.parseFloat(item.value);
    return sum + (Number.isNaN(value) ? 0 : value);
  }, 0);
  const openCount = filteredOpportunities.filter((item) => item.status === "open").length;
  const wonCount = filteredOpportunities.filter((item) => item.status === "won").length;
  const hasActiveFilters = Object.values(filters).some(
    (value) => String(value).trim() !== ""
  );

  const handleDeleteOpportunity = async (opportunityId) => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      try {
        await dispatch(deleteOpportunity(opportunityId)).unwrap();
        dispatch(
          getOpportunities({
            page: currentPage,
            ...filters,
          })
        );
      } catch (err) {
        console.log("Delete failed", err);
      }
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      stage_id: "",
      status: "",
      is_active: "",
    });
    setCurrentPage(1);
  };

  if (loading.fetch) {
    return <Loader text="Opportunities loading..." size="lg" />;
  }

  if (error.fetch) {
    console.log(error.fetch);
  }

  return (
    <div className="opportunities">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Opportunities
          </h1>
          <p className="text-gray-600 mt-1">
            Manage active deals and track their progress
          </p>
        </div>
        <div className="flex gap-3">
          <CustomButton
            variant="border"
            leftIcon={<Download className="w-4 h-4" />}
            disabled
          >
            Export
          </CustomButton>
          <CustomButton
            leftIcon={<UserPlus size={16} />}
            variant="themePrimary"
            onClick={() =>
              openModal({
                title: "Add Opportunity",
                size: "xl",
                content: <OpportunityForm closeModal={closeModal} />,
              })
            }
          >
            Add Opportunity
          </CustomButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total opportunities</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Open deals</p>
              <p className="text-2xl font-bold text-gray-900">{openCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-emerald-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Won deals</p>
              <p className="text-2xl font-bold text-gray-900">{wonCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pipeline value</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalValue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="Search by name, description or contact"
            className="w-full px-3 py-2 border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stage
          </label>
          <OpportunityDropdow
            value={filters.stage_id}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, stage_id: value }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
            <option value="hold">Hold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Active
          </label>
          <select
            value={filters.is_active}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, is_active: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <CustomButton
          onClick={handleClearFilters}
          variant="border"
          disabled={!hasActiveFilters}
        >
          Clear Filters
        </CustomButton>
      </div>

      <TabsWithUrl defaultValue="table">
        <TabsList className="flex justify-end mb-3">
          <TabsTrigger value="table">
            <Menu size={22} />
          </TabsTrigger>
          <TabsTrigger value="cards">
            <HiOutlineViewGrid size={22} />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Probability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Close Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOpportunities.map((opportunity) => (
                    <tr key={opportunity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {(opportunity.name || "Opportunity")
                              .split(" ")
                              .map((item) => item[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {opportunity.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {opportunity.description || "No description"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span
                          className="inline-flex items-center gap-2"
                          style={{ color: opportunity.color_code || undefined }}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: opportunity.color_code || "#94a3b8",
                            }}
                          />
                          {opportunity.stage_name ||
                            opportunity.stage?.stage_name ||
                            "No stage"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {opportunity.contact?.name ||
                          opportunity.contact?.email ||
                          (opportunity.contact_id
                            ? `Contact #${opportunity.contact_id}`
                            : "No contact")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {opportunity.currency} {opportunity.value || "0"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {opportunity.probability ?? 0}%
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusStyles[opportunity.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {opportunity.status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {opportunity.expected_close_date || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative group">
                          <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-6 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                            <button
                              onClick={() =>
                                openModal({
                                  title: "View Opportunity Details",
                                  size: "xl",
                                  content: (
                                    <ViewOpportunityDetails
                                      opportunity={opportunity}
                                    />
                                  ),
                                })
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() =>
                                openModal({
                                  title: "Update Opportunity",
                                  size: "xl",
                                  content: (
                                    <OpportunityForm
                                      editOpportunity={opportunity}
                                      closeModal={closeModal}
                                    />
                                  ),
                                })
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteOpportunity(opportunity.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900">
                        {opportunity.name}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        {opportunity.description || "No description"}
                      </p>
                    </div>
                    <div className="relative group">
                      <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-6 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <button
                          onClick={() =>
                            openModal({
                              title: "View Opportunity Details",
                              size: "xl",
                              content: (
                                <ViewOpportunityDetails opportunity={opportunity} />
                              ),
                            })
                          }
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() =>
                            openModal({
                              title: "Update Opportunity",
                              size: "xl",
                              content: (
                                <OpportunityForm
                                  editOpportunity={opportunity}
                                  closeModal={closeModal}
                                />
                              ),
                            })
                          }
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteOpportunity(opportunity.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Stage</span>
                      <span style={{ color: opportunity.color_code || undefined }}>
                        {opportunity.stage_name ||
                          opportunity.stage?.stage_name ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Value</span>
                      <span className="font-medium">
                        {opportunity.currency} {opportunity.value || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Probability</span>
                      <span>{opportunity.probability ?? 0}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Close date</span>
                      <span>{opportunity.expected_close_date || "N/A"}</span>
                    </div>
                    <div className="pt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusStyles[opportunity.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {opportunity.status || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </TabsWithUrl>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Page <span className="font-medium">{pagination.current_page || currentPage}</span> of{" "}
          <span className="font-medium">{pagination.last_page}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((pagination.current_page || currentPage) - 1)}
            disabled={(pagination.current_page || currentPage) === 1}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex space-x-1">
            {Array.from({ length: pagination.last_page || 1 }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  (pagination.current_page || currentPage) === index + 1
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((pagination.current_page || currentPage) + 1)}
            disabled={(pagination.current_page || currentPage) >= (pagination.last_page || 1)}
            className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 rotate-180"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityList;
