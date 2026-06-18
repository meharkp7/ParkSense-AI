from app.services.dashboard_service import DashboardService
from app.services.analytics_service import AnalyticsService


class AIService:

    @staticmethod
    def generate_insights():

        kpis = DashboardService.get_kpis()
        roads = AnalyticsService.get_top_roads(3)

        insights = []

        if kpis["high_risk_zones"] > 10000:
            insights.append({
                "type": "warning",
                "title": "High Risk Alert",
                "message":
                    f'{kpis["high_risk_zones"]:,} high-risk zones require enforcement.'
            })

        if roads:
            road = roads[0]

            insights.append({
                "type": "critical",
                "title": "Critical Corridor",
                "message":
                    f'{road["location"].split(",")[0]} has PCI {(road["avg_pci"] * 100):.0f}%.'
            })

        if roads:
            road = roads[0]

            insights.append({
                "type": "recommendation",
                "title": "Recommended Action",
                "message":
                    f'Deploy additional patrols near {road["location"].split(",")[0]} where PCI is {(road["avg_pci"] * 100):.0f}%.'
            })

        return insights