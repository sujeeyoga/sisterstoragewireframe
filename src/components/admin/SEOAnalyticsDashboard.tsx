import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, TrendingUp, Eye, MousePointer, Target, Award } from "lucide-react";
import { format, subDays } from "date-fns";
import { useSEOAnalytics, useSEOSummary, useKeywordRankings, usePagePerformance } from "@/hooks/useSEOAnalytics";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SEODataSync } from "./SEODataSync";
import { SearchEnginePing } from "./SearchEnginePing";

const SEOAnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const { data: seoData, isLoading: isLoadingSEO } = useSEOAnalytics(dateRange);
  const { data: summary, isLoading: isLoadingSummary } = useSEOSummary(dateRange);
  const { data: keywords, isLoading: isLoadingKeywords } = useKeywordRankings();
  const { data: performance, isLoading: isLoadingPerformance } = usePagePerformance();

  const topPages = seoData?.slice(0, 10) || [];

  return (
    <div className="space-y-6">
      {/* SEO Data Sync Tool */}
      <SEODataSync />

      {/* Search Engine Ping Tool */}
      <SearchEnginePing />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track search engine performance and keyword rankings
          </p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("justify-start text-left font-normal")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingSummary ? "..." : summary?.totalImpressions.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Search result views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingSummary ? "..." : summary?.totalClicks.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">Organic clicks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingSummary ? "..." : `${summary?.avgCTR.toFixed(2)}%` || "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Click-through rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Position</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingSummary ? "..." : summary?.avgPosition.toFixed(1) || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Search ranking</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Top Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>
                Pages with the most search visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSEO ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : topPages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No SEO data available yet. Data will appear as your site gains search visibility.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Impressions</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                      <TableHead className="text-right">Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPages.map((page, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">{page.page_title || page.page_path}</div>
                            <div className="text-xs text-muted-foreground">{page.page_path}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{page.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{page.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{page.ctr.toFixed(2)}%</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={page.avg_position <= 10 ? "default" : "secondary"}>
                            {page.avg_position.toFixed(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
              <CardDescription>
                Track your most important keyword positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingKeywords ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !keywords || keywords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No keyword tracking data yet. Add keywords to track their rankings.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Position</TableHead>
                      <TableHead className="text-right">Search Volume</TableHead>
                      <TableHead className="text-right">Difficulty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keywords.slice(0, 20).map((kw) => (
                      <TableRow key={kw.id}>
                        <TableCell className="font-medium">{kw.keyword}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{kw.page_path}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={kw.position <= 10 ? "default" : kw.position <= 20 ? "secondary" : "outline"}>
                            #{kw.position}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{kw.search_volume.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={kw.difficulty > 70 ? "destructive" : kw.difficulty > 40 ? "secondary" : "default"}>
                            {kw.difficulty}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Performance Scores</CardTitle>
              <CardDescription>
                Technical SEO and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPerformance ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !performance || performance.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No performance data yet. Run performance audits to see metrics.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">SEO Score</TableHead>
                      <TableHead className="text-right">Performance</TableHead>
                      <TableHead className="text-right">Accessibility</TableHead>
                      <TableHead className="text-right">Load Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performance.map((perf, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{perf.page_path}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={
                            (perf.seo_score || 0) >= 90 ? "default" :
                            (perf.seo_score || 0) >= 70 ? "secondary" : "destructive"
                          }>
                            {perf.seo_score || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={
                            (perf.performance_score || 0) >= 90 ? "default" :
                            (perf.performance_score || 0) >= 70 ? "secondary" : "destructive"
                          }>
                            {perf.performance_score || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={
                            (perf.accessibility_score || 0) >= 90 ? "default" :
                            (perf.accessibility_score || 0) >= 70 ? "secondary" : "destructive"
                          }>
                            {perf.accessibility_score || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {perf.load_time_ms ? `${(perf.load_time_ms / 1000).toFixed(2)}s` : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOAnalyticsDashboard;
