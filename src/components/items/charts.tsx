import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
	PieChart,
	Legend,
	Pie,
	Cell,
	ResponsiveContainer,
	PieLabelRenderProps,
	BarChart,
	Bar,
	XAxis,
	Tooltip,
} from "recharts";
import { apiGetItemsCount } from "../../lib/api-client";
import ItemsLoading from "./items-loading";
import ItemError from "./item-error";

export default function Charts() {
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["query-items-count"],
		queryFn: ({ signal }) => apiGetItemsCount({ signal }),
	});

	const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d927f7"];

	const radian = Math.PI / 180;
	const renderCustomizedLabel = useCallback(
		({
			cx,
			cy,
			midAngle,
			innerRadius,
			outerRadius,
			percent,
		}: PieLabelRenderProps) => {
			const radius =
				Number(innerRadius) +
				(Number(outerRadius) - Number(innerRadius)) * 0.5;
			const x = Number(cx) + radius * Math.cos(-Number(midAngle) * radian);
			const y = Number(cy) + radius * Math.sin(-Number(midAngle) * radian);

			return (
				<text
					x={x}
					y={y}
					fill="white"
					textAnchor={x > Number(cx) ? "start" : "end"}
					dominantBaseline="central"
				>
					{`${(Number(percent) * 100).toFixed(0)}%`}
				</text>
			);
		},
		[],
	);

	if (isLoading) {
		return <ItemsLoading />;
	}

	if (isError && error) {
		return <ItemError error={error} />;
	}

	const filtered = data?.filter((d) => d.count !== 0);

	return (
		<div className="flex w-full flex-col gap-4">
			<h1 className="m-2 text-2xl font-bold text-neutral-700 sm:m-4">
				Chart Analysis:
			</h1>
			{filtered?.length === 0 ? (
				<h2 className="mx-4 font-bold text-neutral-700">No items yet</h2>
			) : (
				Array.isArray(data) && (
					<div className="flex h-full w-full flex-col gap-2 pb-16 md:pb-0 lg:flex-row">
						<ResponsiveContainer width={"100%"} height={400}>
							<PieChart width={400} height={400}>
								<Tooltip />
								<Legend />
								<Pie
									data={data}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={renderCustomizedLabel}
									outerRadius={100}
									fill="#8884d8"
									dataKey="count"
								>
									{data.map((_, index) => (
										<Cell
											key={`cell-${index}`}
											fill={colors[index % colors.length]}
										/>
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
						<ResponsiveContainer width="100%" height={400}>
							<BarChart width={150} height={40} data={data}>
								<XAxis dataKey="name" />
								<Tooltip />
								<Legend />
								<Bar dataKey="count" fill="#8884d8" />
							</BarChart>
						</ResponsiveContainer>
					</div>
				)
			)}
		</div>
	);
}
